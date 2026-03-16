import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const INITIAL_COUNT = 6;

const NEWS = [
  {
    id: 1,
    region: "norway",
    tag: "Tech",
    headline: "Norway invests 4B NOK in green AI data centers",
    summary:
      "Statsbudsjettet oker satsing pa barekraftig teknologi, med nye datasentre langs kysten som skal drives av fornybar energi.",
    why: "Norwegian tech grads are first in line for these roles and can help design the next generation of climate-friendly infrastructure.",
    time: "2h ago",
    url: "#",
  },
  {
    id: 2,
    region: "international",
    tag: "AI",
    headline: "OpenAI unveils new reasoning model beating o3",
    summary:
      "A new architecture pushes state-of-the-art on 14 benchmarks and focuses specifically on reliable step‑by‑step reasoning.",
    why: "This directly affects the tools you will use as a developer, from code assistants to research copilots in your projects.",
    time: "4h ago",
    url: "#",
  },
  {
    id: 3,
    region: "norway",
    tag: "Students",
    headline: "NTNU opens Norway's largest XR lab for students",
    summary:
      "The new lab samler VR, AR og mixed reality‑utstyr og gir gratis tilgang til alle studenter ved NTNU.",
    why: "You can use this space for your next portfolio project, user studies or design experiments in HCI courses.",
    time: "1d ago",
    url: "#",
  },
  {
    id: 4,
    region: "international",
    tag: "Web Dev",
    headline: "React 20 drops with native Suspense caching",
    summary:
      "React‑teamet lanserer en ny versjon med innebygd caching for data‑henting og mer forutsigbare loading‑states.",
    why: "This changes how you structure almost every React app you build from now on, including course projects.",
    time: "6h ago",
    url: "#",
  },
  {
    id: 5,
    region: "norway",
    tag: "Jobs",
    headline: "Aker BP and Equinor seek 300 new IT employees",
    summary:
      "De store energiselskapene trapper opp digitaliseringsløp med fokus pa data engineering, visual analytics og AI‑plattform.",
    why: "Big salaries, long‑term stability and spennende data‑problemstillinger gjør dette relevant når du nærmer deg jobbmarkedet.",
    time: "3d ago",
    url: "#",
  },
  {
    id: 6,
    region: "international",
    tag: "Security",
    headline: "Critical zero-day found in Node.js 22 runtime",
    summary:
      "En sårbarhet i HTTP‑stacken gjør det mulig a krasje eller overta enkelte Node‑applikasjoner hvis de ikke patches.",
    why: "If you run Express apps or server‑side tooling for your projects, you should understand how to patch and redeploy safely.",
    time: "1h ago",
    url: "#",
  },
  {
    id: 7,
    region: "norway",
    tag: "Startup",
    headline: "Cognite raises 500M NOK in new funding round",
    summary:
      "Industridata‑selskapet utvider teamene sine pa tvers av Oslo og Trondheim, med fokus pa produkt, data og design.",
    why: "Great case study for entrepreneurship class og et sted hvor HCI‑kompetanse faktisk brukes i store industriprosjekter.",
    time: "5d ago",
    url: "#",
  },
  {
    id: 8,
    region: "international",
    tag: "Design",
    headline: "Apple Intelligence redesign leaks before WWDC",
    summary:
      "Skjermbilder viser nye UI‑mønstre med glassomorphism, kontekstuelle kort og diskrete AI‑hint i hele systemet.",
    why: "These patterns vil inspirere porteføljeprosjekter og eksamensoppgaver innen UI‑design de neste par årene.",
    time: "2h ago",
    url: "#",
  },
  {
    id: 9,
    region: "norway",
    tag: "Policy",
    headline: "EU AI Act comes into force for Norwegian firms",
    summary:
      "Nye krav til dokumentasjon, risikovurdering og brukermedvirkning gjelder ogsa for norske selskaper gjennom EØS.",
    why: "Every developer needs a basic understanding of compliance when building AI‑drevne produkter for ekte brukere.",
    time: "1w ago",
    url: "#",
  },
  {
    id: 10,
    region: "international",
    tag: "Open Source",
    headline: "Meta releases Llama 4 with 1M token context",
    summary:
      "Den nye modellen er multimodal, har lang kontekst og er tilgjengelig med åpne vekter for kommersiell bruk.",
    why: "You can actually build on top of this in your next project without paying for API‑tokens, if the license fits.",
    time: "3h ago",
    url: "#",
  },
  {
    id: 11,
    region: "norway",
    tag: "Conference",
    headline: "NIKT 2026 announces dedicated HCAI track",
    summary:
      "The national ICT conference adds a full track for human‑centred AI papers, demos and student projects.",
    why: "Perfect venue if you want to publish project work from IDG courses or master's thesis.",
    time: "2w ago",
    url: "#",
  },
  {
    id: 12,
    region: "international",
    tag: "Education",
    headline: "Coursera launches free AI safety specialization",
    summary:
      "A new course series focuses on alignment, evaluation and practical safety techniques for deployed systems.",
    why: "Great background material if you plan to work on responsible AI or policy after graduation.",
    time: "5d ago",
    url: "#",
  },
  {
    id: 13,
    region: "norway",
    tag: "Community",
    headline: "Trondheim AI meetup hits 500 members",
    summary:
      "Local developers, researchers and students meet monthly to share demos and discuss new ML and UX work.",
    why: "Low‑pressure place to present your own prototypes and expand your network in the city.",
    time: "1d ago",
    url: "#",
  },
  {
    id: 14,
    region: "international",
    tag: "Tools",
    headline: "New open-source dashboard for LLM evals",
    summary:
      "A lightweight web UI lets you track prompts, metrics and human feedback across multiple models.",
    why: "Useful for evaluating chatbots and assistants you build in the HCAI lab with real users.",
    time: "8h ago",
    url: "#",
  },
];

// ─── NewsCard ────────────────────────────────────────────────────────────────
// Block: news-card
// Elements: news-card__tag, news-card__title, news-card__summary,
//           news-card__why, news-card__footer, news-card__time, news-card__star
// Modifiers: news-card--saved, news-card--featured
function NewsCard({ item, saved, onStar, onOpen, isFeatured = false }) {
  return (
    <article
      className={[
        "news-card",
        saved ? "news-card--saved" : "",
        isFeatured ? "news-card--featured" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onOpen(item)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(item)}
      tabIndex={0}
      role="button"
      aria-label={`Read article: ${item.headline}`}
      aria-pressed={saved}
    >
      <span className="news-card__tag" aria-label={`Category: ${item.tag}`}>{item.tag}</span>
      <p className="news-card__title">{item.headline}</p>
      <p className="news-card__summary">{item.summary}</p>
      {item.why && <div className="news-card__why" aria-label="Why this matters">{item.why}</div>}
      <div className="news-card__footer">
        <span className="news-card__time" aria-label={`Published ${item.time}`}>{item.time}</span>
        <button
          type="button"
          className={`news-card__star${saved ? " news-card__star--on" : ""}`}
          aria-label={saved ? `Remove ${item.headline} from favorites` : `Save ${item.headline} to favorites`}
          aria-pressed={saved}
          onClick={(e) => {
            e.stopPropagation();
            onStar(item.id);
          }}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>
    </article>
  );
}

// ─── NewsRail ────────────────────────────────────────────────────────────────
// Block: news-rail
// Elements: news-rail__label, news-rail__track
function NewsRail({ label, items, saved, onStar, onOpen }) {
  if (!items.length) return null;

  return (
    <section className="news-rail" aria-label={`${label} news`}>
      <p className="news-rail__label" aria-hidden="true">{label}</p>
      <div className="news-rail__track" role="list" aria-label={`${label} news cards`}>
        {items.map((item, index) => (
          <NewsCard
            key={item.id}
            item={item}
            saved={saved.has(item.id)}
            onStar={onStar}
            onOpen={onOpen}
            isFeatured={index === 1}
          />
        ))}
      </div>
    </section>
  );
}

// ─── NewsSidebar ─────────────────────────────────────────────────────────────
// Block: news-sidebar
// Elements: news-sidebar__title, news-sidebar__item, news-sidebar__empty
function NewsSidebar({ favItems }) {
  return (
    <aside className="news-sidebar" aria-label="Saved articles">
      <p className="news-sidebar__title" id="sidebar-heading">Favorites</p>
      {favItems.length === 0 ? (
        <p className="news-sidebar__empty" aria-live="polite">Star a card to save it.</p>
      ) : (
        <ul aria-labelledby="sidebar-heading" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {favItems.map((item) => (
            <li key={item.id} className="news-sidebar__item" aria-label={`Saved: ${item.headline}`}>
              <strong>{item.tag}</strong> —{" "}
              {item.headline.length > 38
                ? `${item.headline.slice(0, 38)}...`
                : item.headline}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

// ─── NewsModal ───────────────────────────────────────────────────────────────
// Block: news-modal
// Elements: news-modal__overlay, news-modal__close, news-modal__title,
//           news-modal__summary, news-modal__why, news-modal__footer,
//           news-modal__link, news-modal__meta
function NewsModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return;
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [item, onClose]);

  if (!item) return null;
  return (
    <div
      className="news-modal__overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Article: ${item.headline}`}
    >
      <div className="news-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="news-modal__close"
          aria-label="Close article"
          autoFocus
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="news-modal__title">{item.headline}</h2>
        <p className="news-modal__summary">{item.summary}</p>
        {item.why && (
          <div className="news-modal__why" aria-label="Why this matters">
            {item.why}
          </div>
        )}
        <div className="news-modal__footer">
          <a
            className="news-modal__link"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open full article: ${item.headline} (opens in new tab)`}
          >
            Open article
          </a>
          <p className="news-modal__meta" aria-label={`Published ${item.time}`}>{item.time}</p>
        </div>
      </div>
    </div>
  );
}

// ─── News (page) ─────────────────────────────────────────────────────────────
// Block: news-page
// Elements: news-page__back, news-page__topbar, news-page__title,
//           news-page__toggle, news-page__toggle-btn, news-page__layout,
//           news-page__main, news-page__more, news-page__more-btn
// Modifiers: news-page__toggle-btn--active
export default function News() {
  const navigate = useNavigate();
  const [region, setRegion] = useState("norway");
  const [saved, setSaved] = useState(new Set());
  const [count, setCount] = useState(INITIAL_COUNT);
  const [activeItem, setActiveItem] = useState(null);

  const toggleStar = (id) =>
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const pool = NEWS.slice(0, count);
  const norItems = pool.filter((n) => n.region === "norway");
  const intlItems = pool.filter((n) => n.region === "international");
  const favItems = NEWS.filter((n) => saved.has(n.id));

  return (
    <>
      <div className="news-page">
        <button
          type="button"
          className="news-page__back"
          aria-label="Go back to previous page"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        <div className="news-page__topbar">
          <h1 className="news-page__title">
            AI News &amp; <span>Highlights</span>
          </h1>
          <nav aria-label="Filter news by region">
            <div className="news-page__toggle" role="group" aria-label="Region filter">
              {[
                ["norway", "Norway"],
                ["international", "International"],
              ].map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  className={`news-page__toggle-btn${
                    region === k ? " news-page__toggle-btn--active" : ""
                  }`}
                  aria-pressed={region === k}
                  aria-label={`Show ${label} news`}
                  onClick={() => setRegion(k)}
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className="news-page__layout">
          <main className="news-page__main">
            {(region === "norway" || region === "all") && (
              <NewsRail
                label="Norway"
                items={norItems}
                saved={saved}
                onStar={toggleStar}
                onOpen={setActiveItem}
              />
            )}
            {(region === "international" || region === "all") && (
              <NewsRail
                label="International"
                items={intlItems}
                saved={saved}
                onStar={toggleStar}
                onOpen={setActiveItem}
              />
            )}
            <div className="news-page__more">
              {count > INITIAL_COUNT && (
                <button
                  type="button"
                  className="news-page__more-btn"
                  onClick={() => setCount(INITIAL_COUNT)}
                >
                  Show less
                </button>
              )}
              {count < NEWS.length && (
                <button
                  type="button"
                  className="news-page__more-btn"
                  onClick={() => setCount((c) => Math.min(c + 4, NEWS.length))}
                >
                  More news
                </button>
              )}
            </div>
          </main>

          <NewsSidebar favItems={favItems} />
        </div>
      </div>

      <NewsModal item={activeItem} onClose={() => setActiveItem(null)} />
    </>
  );
}

// todo
// Add more news and the links to the articles
// Make the cards more interactive and visually appealing, maybe add images or icons
// fix the coloring of the tags to be more distinct and visually appealing
// fix the railing animation to be smoother and less jarring when it loops back to the start
// consider adding a "trending" or "most popular" section based on the number of stars
