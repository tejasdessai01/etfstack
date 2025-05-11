import { NextRequest } from 'next/server';
import { intentFromPrompt } from '@/lib/intent';
import { topEtfs } from '@/lib/getEtfs';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const tags = await intentFromPrompt(prompt);
  const etfs = await topEtfs(tags);

  return Response.json({ tags, etfs });
}
