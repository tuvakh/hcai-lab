import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// Kept at module level so it is never re-created on render.
// ─────────────────────────────────────────────────────────────────────────────
const NEWS = [
  { id: 1,  region: "norway",        tag: "Tech",        headline: "Norway invests 4B NOK in green AI data centers",       summary: "Statsbudsjettet oker satsing pa barekraftig teknologi, med nye datasentre langs kysten som skal drives av fornybar energi.", why: "Norwegian tech grads are first in line for these roles and can help design the next generation of climate-friendly infrastructure.", time: "2023-10-01T14:00:00Z",  url: "#" },
  { id: 2,  region: "international", tag: "AI",          headline: "OpenAI unveils new reasoning model beating o3",         summary: "A new architecture pushes state-of-the-art on 14 benchmarks and focuses specifically on reliable step‑by‑step reasoning.",         why: "This directly affects the tools you will use as a developer, from code assistants to research copilots in your projects.",           time: "2023-10-01T12:00:00Z",  url: "#" },
  { id: 3,  region: "norway",        tag: "Students",    headline: "NTNU opens Norway's largest XR lab for students",       summary: "The new lab samler VR, AR og mixed reality‑utstyr og gir gratis tilgang til alle studenter ved NTNU.",                          why: "You can use this space for your next portfolio project, user studies or design experiments in HCI courses.",                         time: "2023-09-30T10:00:00Z",  url: "#" },
  { id: 4,  region: "international", tag: "Web Dev",     headline: "React 20 drops with native Suspense caching",           summary: "React‑teamet lanserer en ny versjon med innebygd caching for data‑henting og mer forutsigbare loading‑states.",                 why: "This changes how you structure almost every React app you build from now on, including course projects.",                            time: "2023-10-01T08:00:00Z",  url: "#" },
  { id: 5,  region: "norway",        tag: "Jobs",        headline: "Aker BP and Equinor seek 300 new IT employees",         summary: "De store energiselskapene trapper opp digitaliseringsløp med fokus pa data engineering, visual analytics og AI‑plattform.",     why: "Big salaries, long‑term stability and spennende data‑problemstillinger gjør dette relevant når du nærmer deg jobbmarkedet.",        time: "2023-09-28T14:00:00Z",  url: "#" },
  { id: 6,  region: "international", tag: "Security",   headline: "Critical zero-day found in Node.js 22 runtime",         summary: "En sårbarhet i HTTP‑stacken gjør det mulig a krasje eller overta enkelte Node‑applikasjoner hvis de ikke patches.",            why: "If you run Express apps or server‑side tooling for your projects, you should understand how to patch and redeploy safely.",          time: "2023-10-01T15:00:00Z",  url: "#" },
  { id: 7,  region: "norway",        tag: "Startup",     headline: "Cognite raises 500M NOK in new funding round",          summary: "Industridata‑selskapet utvider teamene sine pa tvers av Oslo og Trondheim, med fokus pa produkt, data og design.",             why: "Great case study for entrepreneurship class og et sted hvor HCI‑kompetanse faktisk brukes i store industriprosjekter.",             time: "2023-09-26T14:00:00Z",  url: "#" },
  { id: 8,  region: "international", tag: "Design",     headline: "Apple Intelligence redesign leaks before WWDC",         summary: "Skjermbilder viser nye UI‑mønstre med glassomorphism, kontekstuelle kort og diskrete AI‑hint i hele systemet.",               why: "These patterns vil inspirere porteføljeprosjekter og eksamensoppgaver innen UI‑design de neste par årene.",                        time: "2023-10-01T14:00:00Z",  url: "#" },
  { id: 9,  region: "norway",        tag: "Policy",      headline: "EU AI Act comes into force for Norwegian firms",        summary: "Nye krav til dokumentasjon, risikovurdering og brukermedvirkning gjelder ogsa for norske selskaper gjennom EØS.",              why: "Every developer needs a basic understanding of compliance when building AI‑drevne produkter for ekte brukere.",                    time: "2023-09-24T14:00:00Z",  url: "#" },
  { id: 10, region: "international", tag: "Open Source", headline: "Meta releases Llama 4 with 1M token context",           summary: "Den nye modellen er multimodal, har lang kontekst og er tilgjengelig med åpne vekter for kommersiell bruk.",                   why: "You can actually build on top of this in your next project without paying for API‑tokens, if the license fits.",                    time: "2023-10-01T13:00:00Z",  url: "#" },
  { id: 11, region: "norway",        tag: "Conference",  headline: "NIKT 2026 announces dedicated HCAI track",              summary: "The national ICT conference adds a full track for human‑centred AI papers, demos and student projects.",                        why: "Perfect venue if you want to publish project work from IDG courses or master's thesis.",                                            time: "2023-09-20T14:00:00Z",  url: "#" },
  { id: 12, region: "international", tag: "Education",  headline: "Coursera launches free AI safety specialization",       summary: "A new course series focuses on alignment, evaluation and practical safety techniques for deployed systems.",                      why: "Great background material if you plan to work on responsible AI or policy after graduation.",                                       time: "2023-09-26T14:00:00Z",  url: "#" },
];

// Pre-filtered at module level — never re-created on render
const ALL_NOR  = NEWS.filter((n) => n.region === "norway");
const ALL_INTL = NEWS.filter((n) => n.region === "international");
const INIT_NOR  = Math.min(3, ALL_NOR.length);
const INIT_INTL = Math.min(3, ALL_INTL.length);

// ─────────────────────────────────────────────────────────────────────────────
// NewsCard
//
// BEM block  : news-card
// Elements   : news-card__tag, news-card__title, news-card__summary,
//              news-card__why, news-card__footer, news-card__time, news-card__star
// Modifiers  : news-card--saved, news-card--featured
//
// Accessibility
//   - <article> is the correct landmark for a self-contained piece of content
//   - tabIndex + onKeyDown make it keyboard-navigable
//   - aria-label describes the card action to screen readers
//   - The star button has its own independent aria-label and aria-pressed
// ─────────────────────────────────────────────────────────────────────────────
function NewsCard({ item, saved, onStar, onOpen, isFeatured = false }) {
  const classes = ["news-card", saved && "news-card--saved", isFeatured && "news-card--featured"]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={classes}
      tabIndex={0}
      aria-label={`${item.tag} — ${item.headline}`}
      onClick={() => onOpen(item)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(item)}
    >
      {/* Tag badge */}
      <span className="news-card__tag">{item.tag}</span>

      {/* Headline — h3 because it lives inside an <section> that already has a label */}
      <h3 className="news-card__title">{item.headline}</h3>

      {/* Summary */}
      <p className="news-card__summary">{item.summary}</p>

      {/* Why it matters — only rendered when present */}
      {item.why && (
        <p className="news-card__why">
          <span className="news-card__why-label" aria-hidden="true">Why it matters — </span>
          {item.why}
        </p>
      )}

      {/* Footer: timestamp + save toggle */}
      <div className="news-card__footer">
        <time className="news-card__time" dateTime={new Date(item.time).toISOString()}>
          {item.time}
        </time>
        <button
          type="button"
          className={`news-card__star${saved ? " news-card__star--on" : ""}`}
          aria-label={saved ? `Remove "${item.headline}" from favorites` : `Save "${item.headline}" to favorites`}
          aria-pressed={saved}
          onClick={(e) => { e.stopPropagation(); onStar(item.id); }}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NewsRail
//
// BEM block  : news-rail
// Elements   : news-rail__label, news-rail__track
//
// Accessibility
//   - <section> with aria-label provides a named landmark
//   - The label <p> is aria-hidden because the section already announces itself
//   - Cards sit in a <ul>/<li> list so screen readers announce count ("3 items")
// ─────────────────────────────────────────────────────────────────────────────
function NewsRail({ label, items, saved, onStar, onOpen }) {
  if (!items.length) return null;

  return (
    <section className="news-rail" aria-label={`${label} news`}>
      <p className="news-rail__label" aria-hidden="true">{label}</p>
      <ul className="news-rail__track">
        {items.map((item, index) => (
          <li key={item.id} className="news-rail__item">
            <NewsCard
              item={item}
              saved={saved.has(item.id)}
              onStar={onStar}
              onOpen={onOpen}
              isFeatured={index === 1}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NewsSidebar
//
// BEM block  : news-sidebar
// Elements   : news-sidebar__heading, news-sidebar__list,
//              news-sidebar__item, news-sidebar__empty
//
// Accessibility
//   - <aside> is the correct landmark for supplementary content
//   - Heading uses <h2> so it is discoverable in the document outline
//   - Favorites list is a proper <ul> — screen readers announce item count
//   - aria-live="polite" on empty state announces when the first item is starred
// ─────────────────────────────────────────────────────────────────────────────
function NewsSidebar({ favItems }) {
  return (
    <aside className="news-sidebar" aria-labelledby="sidebar-heading">
      <h2 className="news-sidebar__heading" id="sidebar-heading">Favorites</h2>

      {favItems.length === 0 ? (
        <p className="news-sidebar__empty" aria-live="polite">
          Star a card to save it here.
        </p>
      ) : (
        <ul className="news-sidebar__list">
          {favItems.map((item) => (
            <li
              key={item.id}
              className="news-sidebar__item"
              aria-label={`Saved article: ${item.headline}`}
            >
              <strong className="news-sidebar__item-tag">{item.tag}</strong>
              {" — "}
              <span className="news-sidebar__item-title">
                {item.headline.length > 40
                  ? `${item.headline.slice(0, 40)}…`
                  : item.headline}
              </span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NewsModal
//
// BEM block  : news-modal
// Elements   : news-modal__overlay, news-modal__close, news-modal__title,
//              news-modal__summary, news-modal__why, news-modal__footer,
//              news-modal__link, news-modal__meta
//
// Accessibility
//   - role="dialog" + aria-modal="true" traps screen reader context inside
//   - aria-labelledby points to the visible h2 — preferred over aria-label
//   - autoFocus on close button so keyboard focus lands inside the modal
//   - Escape key closes the modal (registered/cleaned up via useEffect)
// ─────────────────────────────────────────────────────────────────────────────
function NewsModal({ item, onClose }) {
  // Register Escape key listener only while modal is open
  useEffect(() => {
    if (!item) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [item, onClose]);

  if (!item) return null;

  return (
    // Overlay — click outside to close
    <div
      className="news-modal__overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      {/* Panel — stop clicks bubbling to overlay */}
      <div
        className="news-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close — autoFocus so keyboard users land here immediately */}
        <button
          type="button"
          className="news-modal__close"
          aria-label="Close article"
          autoFocus
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="news-modal__title" id="modal-title">
          {item.headline}
        </h2>

        <p className="news-modal__summary">{item.summary}</p>

        {item.why && (
          <p className="news-modal__why">
            <span className="news-modal__why-label" aria-hidden="true">Why it matters — </span>
            {item.why}
          </p>
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
          <time className="news-modal__meta" dateTime={new Date(item.time).toISOString()}>
            {item.time}
          </time>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// News  (page root)
//
// BEM block  : news-page
// Elements   : news-page__back, news-page__topbar, news-page__title,
//              news-page__toggle, news-page__toggle-btn,
//              news-page__layout, news-page__main,
//              news-page__more, news-page__more-btn
// Modifiers  : news-page__toggle-btn--active
//
// State
//   region     — "norway" | "international"  (which tab is active)
//   norCount   — how many Norway cards are visible
//   intlCount  — how many International cards are visible
//   saved      — Set of starred article ids
//   activeItem — article object currently open in the modal (null = closed)
// ─────────────────────────────────────────────────────────────────────────────
export default function News() {
  const navigate = useNavigate();

  const [region,    setRegion]    = useState("norway");
  const [norCount,  setNorCount]  = useState(INIT_NOR);
  const [intlCount, setIntlCount] = useState(INIT_INTL);
  const [saved,     setSaved]     = useState(new Set());
  const [activeItem, setActiveItem] = useState(null);

  // Toggle a single article in/out of the saved set
  const toggleStar = (id) =>
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // Slice each region's full list down to its current visible count
  const norItems  = ALL_NOR.slice(0, norCount);
  const intlItems = ALL_INTL.slice(0, intlCount);
  const favItems  = NEWS.filter((n) => saved.has(n.id));

  // Derive pagination state for the active region tab
  const count     = region === "norway" ? norCount    : intlCount;
  const total     = region === "norway" ? ALL_NOR.length : ALL_INTL.length;
  const initCount = region === "norway" ? INIT_NOR    : INIT_INTL;
  const setCount  = region === "norway" ? setNorCount : setIntlCount;

  const canShowMore = count < total;
  const canShowLess = count > initCount;

  return (
    <>
      <div className="news-page">

        {/* ── Back navigation ─────────────────────────────────────────────── */}
        <button
          type="button"
          className="news-page__back"
          aria-label="Go back to previous page"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* ── Page header: title + region toggle ──────────────────────────── */}
        <div className="news-page__topbar">
          <h1 className="news-page__title">
            AI News &amp; <span>Highlights</span>
          </h1>

          {/* Region toggle is a <nav> because it controls which content is shown */}
          <nav aria-label="Filter news by region">
            <div
              className="news-page__toggle"
              role="group"
              aria-label="Region filter"
            >
              {[["norway", "Norway"], ["international", "International"]].map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  className={`news-page__toggle-btn${region === k ? " news-page__toggle-btn--active" : ""}`}
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

        {/* ── Main layout: rails + sidebar ────────────────────────────────── */}
        <div className="news-page__layout">

          {/* News rails — only the active region renders */}
          <main className="news-page__main" aria-label="News articles">
            {region === "norway" && (
              <NewsRail
                label="Norway"
                items={norItems}
                saved={saved}
                onStar={toggleStar}
                onOpen={setActiveItem}
              />
            )}
            {region === "international" && (
              <NewsRail
                label="International"
                items={intlItems}
                saved={saved}
                onStar={toggleStar}
                onOpen={setActiveItem}
              />
            )}

            {/* Pagination controls */}
            <div className="news-page__more" role="group" aria-label="Load more or fewer articles">
              {canShowLess && (
                <button
                  type="button"
                  className="news-page__more-btn"
                  aria-label="Show fewer articles"
                  onClick={() => setCount(initCount)}
                >
                  Show less
                </button>
              )}
              {canShowMore && (
                <button
                  type="button"
                  className="news-page__more-btn"
                  aria-label="Load 3 more articles"
                  onClick={() => setCount((c) => Math.min(c + 3, total))}
                >
                  More news
                </button>
              )}
            </div>
          </main>

          {/* Favorites sidebar */}
          <NewsSidebar favItems={favItems} />
        </div>
      </div>

      {/* Modal — rendered outside news-page so it is not clipped by any overflow */}
      <NewsModal item={activeItem} onClose={() => setActiveItem(null)} />
    </>
  );
}

// ─── TODO ────────────────────────────────────────────────────────────────────
// - Add real article URLs
// - Add cover images / tag colour coding
// - "Trending" section sorted by star count
//next goal and milstone: implement with api 
// implement the auto scroll 
// maybe a horizontal scroll for the news rail if there are more than 3 items?