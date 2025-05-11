import { NextRequest } from "next/server";

export const runtime = "edge"; // run this route on Vercel Edge

export async function POST(_req: NextRequest) {
  return new Response(JSON.stringify({ message: "pong" }), {
    headers: { "Content-Type": "application/json" },
  });
}
