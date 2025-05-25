"use client"; // has to be the first line
/* eslint-disable @typescript-eslint/no-explicit-any */


import { useState } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [resp, setResp] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [depth, setDepth] = useState<"simple" | "balanced" | "granular">(
    "simple"
  );
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, depth })
      });
      if (!r.ok) throw new Error(await r.text());
      const json = await r.json();
      setResp(json);
    } catch (e) {
      console.error(e);
      setError("Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6 space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">ETF Stack Chat</h1>

      {/* prompt box */}
      <textarea
        className="w-full border rounded p-3 focus:outline-none focus:ring"
        rows={3}
        placeholder="Describe your investing goal…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* depth dial */}
      <div className="flex items-center gap-4 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="radio"
            value="simple"
            checked={depth === "simple"}
            onChange={() => setDepth("simple")}
          />
          Simple (2)
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            value="balanced"
            checked={depth === "balanced"}
            onChange={() => setDepth("balanced")}
          />
          Balanced (4)
        </label>
        <label className="flex items-center gap-1">
          <input
            type="radio"
            value="granular"
            checked={depth === "granular"}
            onChange={() => setDepth("granular")}
          />
          Granular (6)
        </label>
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Thinking…" : "Ask"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* results */}
      {resp?.etfs && (
        <div className="space-y-3">
          {resp.etfs.map((e: any) => (
            <div
              key={e.ticker}
              className="border rounded p-4 flex justify-between"
            >
              <div>
                <div className="font-medium text-lg">{e.ticker}</div>
                <div className="text-sm text-gray-500">
                  Yield {e.yield_12m ?? "—"}% • Expense {e.expense ?? "—"}% •
                  Vol {e.vol_3y ?? "—"}%
                </div>
              </div>
              <button
                className="bg-black text-white px-4 py-1 rounded text-sm"
                disabled
              >
                Trade
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
