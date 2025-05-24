import 'dotenv/config'; // .env or .env.local auto‑load
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON!
);

type Row = { ticker: string };

const BATCH = 100;          // 100 calls/min free limit

async function main() {
  const { data: rows } = await sb.from('etfs').select('ticker');
  if (!rows) throw new Error('No rows');

  for (let i = 0; i < rows.length; i += BATCH) {
    const chunk: Row[] = rows.slice(i, i + BATCH);
    const tickers = chunk.map((r) => r.ticker).join(',');

    const url = `https://financialmodelingprep.com/api/v3/etf-info?symbols=${tickers}&apikey=${process.env.FMP_KEY}`;
    const resp = await axios.get(url);
    const profiles = resp.data.data;          // FMP nests under .data.data

    const updates = profiles.map((p: any) => ({
        ticker: p.symbol,
        expense: p.expenseRatio,
        yield_12m: p.dividendYield,
        vol_3y: p.threeYearVolatility,
      }));

    await sb
      .from('etfs')
      .upsert(updates, { onConflict: 'ticker' });

    console.log(`Updated ${i + chunk.length}/${rows.length}`);
    await new Promise((r) => setTimeout(r, 65_000)); // respect 100‑req/min
  }
  console.log('refresh complete');
}

main().catch(console.error);
