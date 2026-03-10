import React, { useState, useRef } from "react";

//find another way to do this 
const NEWS = [
  { id: 1, region: "norway", tag: "Tech", headline: "Norway invests 4B NOK in green AI data centers", summary: "Statsbudsjettet oker satsing pa barekraftig teknologi.", why: "Norwegian tech grads are first in line for these roles.", time: "2h ago" },
  { id: 2, region: "international", tag: "AI", headline: "OpenAI unveils new reasoning model beating o3", summary: "New architecture achieves SOTA on 14 benchmarks.", why: "Directly affects tools you will use as a developer.", time: "4h ago" },
  { id: 3, region: "norway", tag: "Students", headline: "NTNU opens Norway's largest XR lab for students", summary: "Free access to VR and AR equipment for all students.", why: "Use this for your next portfolio project.", time: "1d ago" },
  { id: 4, region: "international", tag: "Web Dev", headline: "React 20 drops with native Suspense caching", summary: "Huge DX improvements — no more waterfall fetches.", why: "This changes how you write every React app.", time: "6h ago" },
  { id: 5, region: "norway", tag: "Jobs", headline: "Aker BP and Equinor seek 300 new IT employees", summary: "Both companies are digitising at full speed.", why: "Big salaries and stability — worth watching.", time: "3d ago" },
  { id: 6, region: "international", tag: "Security", headline: "Critical zero-day found in Node.js 22 runtime", summary: "Patch available — all prod apps should update now.", why: "If you run Express apps, update today.", time: "1h ago" },
  { id: 7, region: "norway", tag: "Startup", headline: "Cognite raises 500M NOK in new funding round", summary: "Industrial AI growing fast on the Norwegian shelf.", why: "Great case study for entrepreneurship class.", time: "5d ago" },
  { id: 8, region: "international", tag: "Design", headline: "Apple Intelligence redesign leaks before WWDC", summary: "Glassomorphism is back with added AI context.", why: "Trend-setting UI patterns for your next build.", time: "2h ago" },
  { id: 9, region: "norway", tag: "Policy", headline: "EU AI Act comes into force for Norwegian firms", summary: "New transparency and documentation requirements.", why: "Every developer needs compliance basics.", time: "1w ago" },
  { id: 10, region: "international", tag: "Open Source", headline: "Meta releases Llama 4 with 1M token context", summary: "Multimodal, open weights, free for commercial use.", why: "You can build with this in your next project.", time: "3h ago" },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .news-page {
    min-height: 100vh;
    background: #f7f5f2;
    font-family: 'DM Sans', sans-serif;
    color: #1c1c1c;
    padding: 2.5rem 2rem 4rem;
  }

  /* topbar */
  .news-topbar {
    display: flex;
    align-items: baseline;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
  }
  .news-title {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 400;
    letter-spacing: -0.02em;
    flex: 1;
  }
  .news-title span { font-style: italic; }

  /* toggle */
  .news-toggle {
    display: flex;
    background: #e8e4e0;
    border-radius: 8px;
    padding: 3px;
    gap: 2px;
  }
  .news-toggle button {
    padding: 5px 16px;
    border-radius: 6px;
    border: none;
    background: transparent;
    color: #888;
    font-size: 0.8rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
  }
  .news-toggle button.active {
    background: #1c1c1c;
    color: #fff;
  }

  /* layout */
  .news-layout {
    display: grid;
    grid-template-columns: 1fr 210px;
    gap: 1.5rem;
    align-items: start;
  }

  /* section label */
  .news-section-label {
    font-size: 0.65rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #999;
    font-family: 'Courier New', monospace;
    margin-bottom: 0.75rem;
  }

  /* rail */
  .news-rail { position: relative; margin-bottom: 2rem; }
  .news-track {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 4px 2px 12px;
    scrollbar-width: none;
  }
  .news-track::-webkit-scrollbar { display: none; }

  /* arrows */
  .news-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #f7f5f2;
    border: 1px solid #ddd;
    color: #1c1c1c;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s;
    padding: 0;
  }
  .news-arrow:hover { background: #e8e4e0; }
  .news-arrow-left  { left: -16px; }
  .news-arrow-right { right: -16px; }

  /* card */
  .news-card {
    min-width: 248px;
    max-width: 248px;
    background: #edeae6;
    border: 1px solid rgba(0,0,0,0.07);
    border-radius: 14px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    flex-shrink: 0;
    cursor: pointer;
    transition: transform 0.18s, box-shadow 0.18s;
  }
  .news-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.09);
  }
  .news-card.saved { border-color: rgba(0,0,0,0.18); }

  .news-tag {
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-family: 'Courier New', monospace;
    color: #888;
    background: rgba(0,0,0,0.06);
    padding: 2px 7px;
    border-radius: 4px;
    width: fit-content;
  }
  .news-card-headline {
    font-family: 'Instrument Serif', serif;
    font-size: 1rem;
    line-height: 1.3;
    color: #1c1c1c;
  }
  .news-card-summary {
    font-size: 0.73rem;
    color: #777;
    line-height: 1.5;
  }
  .news-card-why {
    font-size: 0.67rem;
    color: #1c1c1c;
    background: rgba(0,0,0,0.05);
    border-left: 2px solid #1c1c1c;
    padding: 4px 8px;
    border-radius: 0 4px 4px 0;
    line-height: 1.4;
  }
  .news-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.5rem;
    margin-top: auto;
    border-top: 1px solid rgba(0,0,0,0.07);
  }
  .news-card-time {
    font-size: 0.6rem;
    font-family: 'Courier New', monospace;
    color: #aaa;
  }
  .news-star {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: #ccc;
    padding: 0;
    line-height: 1;
    transition: color 0.15s;
  }
  .news-star.on { color: #1c1c1c; }

  /* sidebar */
  .news-sidebar {
    background: #edeae6;
    border: 1px solid rgba(0,0,0,0.07);
    border-radius: 14px;
    padding: 1rem;
    min-height: 280px;
  }
  .news-sidebar-title {
    font-size: 0.82rem;
    font-weight: 700;
    margin-bottom: 0.9rem;
    letter-spacing: -0.01em;
  }
  .news-fav-item {
    font-size: 0.72rem;
    color: #1c1c1c;
    background: rgba(0,0,0,0.05);
    border-radius: 6px;
    padding: 6px 8px;
    margin-bottom: 6px;
    line-height: 1.4;
    border: 1px solid rgba(0,0,0,0.06);
    cursor: pointer;
    transition: background 0.15s;
  }
  .news-fav-item:hover { background: rgba(0,0,0,0.09); }
  .news-fav-empty {
    font-size: 0.72rem;
    color: #bbb;
    font-family: 'Courier New', monospace;
  }

  /* more button */
  .news-more-wrap { display: flex; justify-content: center; padding-top: 0.5rem; }
  .news-more-btn {
    font-size: 0.7rem;
    font-family: 'Courier New', monospace;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    background: #edeae6;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 100px;
    padding: 8px 22px;
    cursor: pointer;
    color: #1c1c1c;
    font-weight: 500;
    transition: background 0.15s;
  }
  .news-more-btn:hover { background: #e0ddd9; }
`;

function NewsCard({ item, saved, onStar }) {
  return (
    <div className={`news-card${saved ? " saved" : ""}`}>
      <span className="news-tag">{item.tag}</span>
      <p className="news-card-headline">{item.headline}</p>
      <p className="news-card-summary">{item.summary}</p>
      {item.why && <div className="news-card-why">{item.why}</div>}
      <div className="news-card-footer">
        <span className="news-card-time">{item.time}</span>
        <button
          className={`news-star${saved ? " on" : ""}`}
          onClick={(e) => { e.stopPropagation(); onStar(item.id); }}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
}

function Rail({ label, items, saved, onStar }) {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d * 280, behavior: "smooth" });
  if (!items.length) return null;
  return (
    <div className="news-rail">
      <p className="news-section-label">{label}</p>
      <button className="news-arrow news-arrow-left" onClick={() => scroll(-1)}>&#8592;</button>
      <div className="news-track" ref={ref}>
        {items.map((item) => (
          <NewsCard key={item.id} item={item} saved={saved.has(item.id)} onStar={onStar} />
        ))}
      </div>
      <button className="news-arrow news-arrow-right" onClick={() => scroll(1)}>&#8594;</button>
    </div>
  );
}

export default function News() {
  const [region, setRegion] = useState("norway");
  const [saved, setSaved] = useState(new Set());
  const [count, setCount] = useState(6);

  const toggleStar = (id) =>
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const pool = NEWS.slice(0, count);
  const norItems  = pool.filter((n) => n.region === "norway");
  const intlItems = pool.filter((n) => n.region === "international");
  const favItems  = NEWS.filter((n) => saved.has(n.id));

  return (
    <>
      <style>{css}</style>
      <div className="news-page">

        <div className="news-topbar">
          <div className="news-toggle">
            {[["norway","Norway"],["international","International"]].map(([k,l]) => (
              <button key={k} className={region === k ? "active" : ""} onClick={() => setRegion(k)}>{l}</button>
            ))}
          </div>
          <h1 className="news-title">AI News &amp; <span>Highlights</span></h1>
        </div>

        <div className="news-layout">
          <div>
            {(region === "norway" || region === "all") && (
              <Rail label="Norway" items={norItems} saved={saved} onStar={toggleStar} />
            )}
            {(region === "international" || region === "all") && (
              <Rail label="International" items={intlItems} saved={saved} onStar={toggleStar} />
            )}
            {count < NEWS.length && (
              <div className="news-more-wrap">
                <button className="news-more-btn" onClick={() => setCount((c) => c + 4)}>
                  More news
                </button>
              </div>
            )}
          </div>

          <aside className="news-sidebar">
            <p className="news-sidebar-title">Favorites</p>
            {favItems.length === 0
              ? <p className="news-fav-empty">Star a card to save it.</p>
              : favItems.map((item) => (
                  <div key={item.id} className="news-fav-item">
                    <strong>{item.tag}</strong> — {item.headline.length > 38 ? item.headline.slice(0,38)+"..." : item.headline}
                  </div>
                ))
            }
          </aside>
        </div>

      </div>
    </>
  );
}
// This is a mockup news page with hardcoded data and no backend. The "news" are fictional and for demonstration purposes only.
// need to make more news pages
// use a styling the matches everyones 
// need a back button 
//fix css so it matches the size and also the scroll has to work 
//make sass for these pages & components 