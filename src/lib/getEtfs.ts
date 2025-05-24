import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON!
);

// beta values for weighting
const VOL_PENALTY  = 0.07;   // bigger = care more about vol
const EXP_PENALTY  = 1.0;    // direct subtraction in %
const YIELD_WEIGHT = 1.0;

export async function topEtfs(tags: { goal: string; depth: string }) {
  let { data } = await sb
    .from('etfs')
    .select('ticker, expense, yield_12m, vol_3y')
    .limit(1500);                        // pull manageable slice

  data = data?.filter((e) => e.yield_12m != null) || [];

  // simple score formula
  const scored = data.map((e) => ({
    ...e,
    score:
      (Number(e.yield_12m)  * YIELD_WEIGHT) -
      (Number(e.expense)    * EXP_PENALTY)  -
      (Number(e.vol_3y)     * VOL_PENALTY),
  }));

  scored.sort((a, b) => b.score - a.score);

  const depth = tags.depth === 'granular' ? 6 : tags.depth === 'balanced' ? 4 : 2;
  return scored.slice(0, depth);
}
