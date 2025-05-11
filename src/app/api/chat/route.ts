import { NextRequest } from "next/server";

export const runtime = "edge";

/* eslint-disable @typescript-eslint/no-unused-vars */
export async function POST(_req: NextRequest) {
  return new Response(JSON.stringify({ message: "pong" }), {
    headers: { "Content-Type": "application/json" },
  });
}
/* eslint-enable @typescript-eslint/no-unused-vars */
