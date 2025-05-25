import { NextRequest } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const sb = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { query, limit = 10 } = await req.json();

  if (!query || typeof query !== "string") {
    return new Response("`query` string required", { status: 400 });
  }

  // 1️⃣  embed the user's search phrase
  const emb = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const vector = emb.data[0].embedding as unknown as number[];

  // 2️⃣  call the SQL helper
  const { data, error } = await sb.rpc("match_etfs", {
    query_embedding: vector,
    match_limit: limit,
  });

  if (error) {
    console.error(error);
    return new Response("Supabase RPC error", { status: 500 });
  }

  return Response.json({ results: data, took: data?.length ?? 0 });
}
