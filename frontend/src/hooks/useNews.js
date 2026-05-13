import { useState, useEffect } from "react";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

// Module-level cache — avoids re-fetching when switching tabs in the same session
const cache = {};

export function useNews(region) {
  const [items,   setItems]   = useState(cache[region] ?? []);
  const [loading, setLoading] = useState(!cache[region]);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (cache[region]) {
      setItems(cache[region]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`${BASE}/api/news?region=${region}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const regionLabel = region === "norway" ? "Norway" : "International";
        const shaped = data.map((a) => ({
          id:        a.id,
          region:    a.region,
          regionTag: regionLabel,
          tag:       a.tag,
          headline:  a.headline,
          summary:   a.summary,
          url:       a.url,
          source:    a.source,
          image:     a.image ?? null,
          time:      a.publishedAt,
          body:      a.body ?? a.summary,
          why:       null,
        }));

        cache[region] = shaped;
        setItems(shaped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [region]);

  return { items, loading, error };
}
