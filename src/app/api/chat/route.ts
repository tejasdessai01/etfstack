import { NextRequest } from 'next/server';
import { intentFromPrompt } from '@/lib/intent';
import { topEtfs } from '@/lib/getEtfs';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { prompt, depth = 'simple' } = await req.json();        // depth = UI radio

  const baseTags = await intentFromPrompt(prompt);              // goal, volatility…

  // create a fresh object that includes depth
  const tags = { ...baseTags, depth } as const;

  const etfs = await topEtfs(tags);

  return Response.json({ tags, etfs });
}
