import { NextRequest } from 'next/server';
import { intentFromPrompt } from '@/lib/intent';   // your existing prompt→tags fn
import { topEtfs } from '@/lib/getEtfs';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { prompt, depth = 'simple' } = await req.json();

  const tags = await intentFromPrompt(prompt);
  tags.depth = depth;                              // attach UI choice

  const etfs = await topEtfs(tags);

  return Response.json({ tags, etfs });
}
