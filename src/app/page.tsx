/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery]   = useState("");
  const [hits,  setHits]    = useState<any[] | null>(null);
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState<string | null>(null);

  async function search() {
    if (!query.trim()) return;
    setLoad(true);
    setError(null);
    try {
      const r = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, limit: 10 }),
      });
      if (!r.ok) throw new Error(await r.text());
      const { results } = await r.json();
      setHits(results);
    } catch (e) {
      console.error(e);
      setError("Search failed. Try again.");
    } finally {
      setLoad(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-8">
      <h1 className="text-4xl font-bold">ETF Stack</h1>

      {/* search bar */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded px-4 py-2"
          placeholder='e.g. "high-dividend AI ETF under 0.5%"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button
          onClick={search}
          disabled={loading}
          className="bg-black text-white px-4 rounded disabled:opacity-50"
        >
          {loading ? "…" : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* results list */}
      {hits && (
        <div className="space-y-3">
          {hits.length === 0 && <p>No matches—try a different phrase.</p>}
          {hits.map((e: any) => (
            <div
              key={e.ticker}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{e.ticker}</div>
                <div className="text-sm text-gray-500">{e.name}</div>
              </div>
              <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                {(e.score * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
