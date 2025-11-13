// src/components/ClimateNews.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { htmlToText, makeExcerpt } from "@/lib/html"; // your util

export default function ClimateNews({ pageSize = 12 }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await fetch(`/api/external/climate?pageSize=${pageSize}`);
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error || "Failed to load climate news");
        setItems(data.items || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [pageSize]);

  if (loading) return <div className="py-8 text-slate-500">Loading climate news…</div>;
  if (error)   return <div className="py-8 text-red-600">{error}</div>;
  if (!items.length) return <div className="py-8 text-slate-500">No results.</div>;

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">From Around the Web</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((a, i) => {
          const text = makeExcerpt(htmlToText(a.summaryHtml || ""), 140);
          return (
            <article key={i} className="rounded-xl border bg-white p-4 shadow-sm">
              {a.image && (
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-44 object-cover rounded-lg mb-3"
                  referrerPolicy="no-referrer"
                />
              )}
              <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer">
                <h3 className="font-semibold text-slate-900 line-clamp-2 hover:underline">{a.title}</h3>
              </a>
              {text && <p className="text-sm text-slate-600 mt-2 line-clamp-3">{text}</p>}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{a.source}</span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {a.publishedAt && new Date(a.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
