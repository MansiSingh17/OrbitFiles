import { NextResponse } from "next/server";
import { register } from "@/lib/metrics/registry";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.METRICS_SECRET_TOKEN;

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const metrics = await register.metrics();
  return new NextResponse(metrics, {
    headers: {
      "Content-Type": register.contentType,
      "ngrok-skip-browser-warning": "true",
    },
  });
}
