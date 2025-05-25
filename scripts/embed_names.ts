import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const sb = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON!
);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  // grab tickers that don't have an embedding yet
  const { data: rows } = await sb
    .from('etfs')
    .select('ticker, name')
    .is('embedding', null)
    .limit(1000);                      // cap to avoid huge first run

  if (!rows?.length) {
    console.log('All rows already embedded 🎉');
    return;
  }

  console.log(`Embedding ${rows.length} rows…`);

  // OpenAI allows batching 100 inputs for embeddings
  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const inputs = batch.map(
      (r) => `${r.ticker}: ${r.name ?? ''}`.trim()
    );

    const res = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: inputs,
    });

    // upsert embeddings back
    const updates = batch.map((row, idx) => ({
      ticker: row.ticker,
      embedding: res.data[idx].embedding as unknown as number[],
    }));

    await sb
      .from('etfs')
      .upsert(updates, { onConflict: 'ticker' });

    console.log(`Upserted ${i + batch.length}/${rows.length}`);
  }

  console.log('Initial embedding pass complete.');
}

main().catch(console.error);
