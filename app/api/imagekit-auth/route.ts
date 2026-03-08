import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { getOrSet, CacheKey, TTL } from "@/lib/redis/cache";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const authParams = await getOrSet(
      CacheKey.imagekitAuth(userId),
      TTL.IMAGEKIT_AUTH,
      async () => imagekit.getAuthenticationParameters()
    );

    return NextResponse.json(authParams);
  } catch (error) {
    console.error("Error generating ImageKit auth params:", error);
    return NextResponse.json({ error: "Failed to generate authentication parameters" }, { status: 500 });
  }
}
