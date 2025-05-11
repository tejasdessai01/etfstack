// src/lib/getEtfs.ts
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON!);

export async function topEtfs(tags: { goal: string; volatility?: string }) {
  // naive rules—tune later
  let query = supabase.from('etfs').select('*');

  if (tags.goal === 'income') query = query.order('yield_12m', { ascending: false });
  if (tags.goal === 'growth') query = query.order('vol_3y', { ascending: true });
  // add expense filter, etc.

  const { data } = await query.limit(4);          // return <=4 tickers
  return data;
}
