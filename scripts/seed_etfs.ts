// --- load env ---------------------------------------------------
import { fileURLToPath } from 'url';
import path from 'path';
import { config } from 'dotenv';

// recreate __dirname for ES‑modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// point dotenv at the project‑root .env.local
config({ path: path.resolve(__dirname, '../.env.local') });

// --- rest of your imports --------------------------------------
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON!
);

function parseCSV(path: string) {
  return fs
    .readFileSync(path, 'utf8')
    .split('\n')
    .slice(1)       // skip header
    .map(l => l.split(',')[0]?.replace(/"/g, '').trim()) // ticker col
    .filter(Boolean);
}

(async () => {
  const tickers = [
    ...new Set([
      ...parseCSV('scripts/data/nyse_etfs.csv'),
      ...parseCSV('scripts/data/nasdaq_etfs.csv')
    ]),
  ];

  for (const t of tickers) {
    await supabase.from('etfs').insert({ ticker: t }).select();
  }
  console.log(`Inserted ${tickers.length} tickers`);
})();
