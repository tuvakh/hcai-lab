// src/pages/News.jsx

import { useState } from "react";
import HeroSection from "../components/HeroSection";
import NewsRail from "../components/NewsRail";
import NewsSidebar from "../components/NewsSidebar";
import NewsModal from "../components/NewsModal";
import { news } from "../data/newsData";

const ALL_NOR   = news.filter((n) => n.region === "norway");
const ALL_INTL  = news.filter((n) => n.region === "international");
const INIT_NOR  = Math.min(3, ALL_NOR.length);
const INIT_INTL = Math.min(3, ALL_INTL.length);

export default function News() {
  const [region,     setRegion]     = useState("norway");
  const [norCount,   setNorCount]   = useState(INIT_NOR);
  const [intlCount,  setIntlCount]  = useState(INIT_INTL);
  const [saved,      setSaved]      = useState(new Set());
  const [activeItem, setActiveItem] = useState(null);

  const toggleStar = (id) =>
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const norItems  = ALL_NOR.slice(0, norCount);
  const intlItems = ALL_INTL.slice(0, intlCount);
  const favItems  = news.filter((n) => saved.has(n.id));

  const count     = region === "norway" ? norCount    : intlCount;
  const total     = region === "norway" ? ALL_NOR.length : ALL_INTL.length;
  const initCount = region === "norway" ? INIT_NOR    : INIT_INTL;
  const setCount  = region === "norway" ? setNorCount : setIntlCount;

  const canShowMore = count < total;
  const canShowLess = count > initCount;

  return (
    <main className="news-page">

      {/* Hero — uses heroSection__intro--* classes like People.jsx */}
      <HeroSection heroImg="/assets/hero/hero-home.png">
        <p className="heroSection__intro--label">Latest Updates</p>
        <h1 className="heroSection__intro--title">AI News &amp; Highlights</h1>
        <p className="heroSection__intro--text">
          The latest in AI, tech and student opportunities — curated for HCAI.
        </p>
      </HeroSection>

      {/* Content */}
      <section className="news-page__content">

        {/* Region filter — Norway blue / International purple from variables */}
        <div className="news-page__filter-bar" role="group" aria-label="Filter news by region">
          <button
            type="button"
            className={`news-page__filter-btn news-page__filter-btn--norway${region === "norway" ? " news-page__filter-btn--active" : ""}`}
            aria-pressed={region === "norway"}
            aria-label="Show Norway news"
            onClick={() => setRegion("norway")}
          >
            Norway
          </button>
          <button
            type="button"
            className={`news-page__filter-btn news-page__filter-btn--international${region === "international" ? " news-page__filter-btn--active" : ""}`}
            aria-pressed={region === "international"}
            aria-label="Show International news"
            onClick={() => setRegion("international")}
          >
            International
          </button>
        </div>

        {/* Card layout: rails + sidebar */}
        <div className="news-page__layout">
          <div className="news-page__main">
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
          </div>

          <NewsSidebar favItems={favItems} onOpen={setActiveItem} />
        </div>
      </section>

      <NewsModal item={activeItem} onClose={() => setActiveItem(null)} />
    </main>
  );
}
