// scripts/seed_etfs.ts – clean, idempotent seeder
// --------------------------------------------------
// 1. Loads SUPABASE_URL & SUPABASE_ANON automatically from .env
// 2. Parses both comma‑ and pipe‑delimited files
// 3. Upserts in 500‑row batches to avoid rate limits
// --------------------------------------------------

import 'dotenv/config';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON!
);

/**
 * Parse NYSE CSV or Nasdaq TXT feed, auto‑detecting delimiter.
 */
function parseFile(filePath: string): string[] {
  return fs
    .readFileSync(filePath, 'utf8')
    .split('\n')
    .filter(Boolean)                // drop blank lines
    .slice(1)                       // skip header row
    .map((row) => {
      const delim = row.includes('|') ? '|' : ',';  // auto‑detect
      return row.split(delim)[0].replace(/"/g, '').trim();
    })
    .filter((sym) => /^[A-Z]+$/.test(sym));         // ensure clean ticker
}

async function main() {
  // --- gather unique tickers ---------------------------------
  const tickers = Array.from(
    new Set([
      ...parseFile('scripts/data/nyse_etfs.csv'),
      ...parseFile('scripts/data/nasdaq_etfs.csv'),
    ])
  );

  const rows = tickers.map((t) => ({ ticker: t }));
  const CHUNK = 500;

  // --- bulk upsert in manageable chunks ----------------------
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    await supabase
      .from('etfs')
      .upsert(chunk, { onConflict: 'ticker', ignoreDuplicates: true });
    console.log(`upserted ${i + chunk.length}/${rows.length}`);
  }

  console.log('seed complete');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
