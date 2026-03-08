import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/api/graphql", "/api/metrics"]);

// Route matchers for rate limiting
const isUploadRoute = createRouteMatcher([
  "/api/files/upload(.*)",
  "/api/upload(.*)",
]);
const isAiRoute = createRouteMatcher([
  "/api/ai/(.*)",
  "/api/documents/chat(.*)",
]);

// Initialize here (not imported from lib) to avoid edge runtime issues
const redis = Redis.fromEnv();

const uploadLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  prefix: "ratelimit:upload",
});

const aiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  prefix: "ratelimit:ai",
});

export default clerkMiddleware(async (auth, request) => {
  const user = auth();
  const userId = (await user).userId;
  const url = new URL(request.url);

  // Redirect authenticated users away from public routes
  if (userId && isPublicRoute(request) && url.pathname !== "/" && !url.pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }

  // Rate limiting — only for authenticated users on guarded routes
  if (userId) {
    let limiter: Ratelimit | null = null;

    if (isUploadRoute(request)) limiter = uploadLimiter;
    else if (isAiRoute(request)) limiter = aiLimiter;

    if (limiter) {
      const { success, remaining, reset } = await limiter.limit(userId);

      if (!success) {
        return NextResponse.json(
          {
            error: "Too many requests. Please slow down.",
            retryAfter: Math.ceil((reset - Date.now()) / 1000),
          },
          {
            status: 429,
            headers: {
              "X-RateLimit-Remaining": String(remaining),
              "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
            },
          }
        );
      }

      // Pass remaining info downstream via headers
      const response = NextResponse.next();
      response.headers.set("X-RateLimit-Remaining", String(remaining));
      return response;
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};