import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import NewsRail from "../components/NewsRail";
import NewsSidebar from "../components/NewsSidebar";
import NewsModal from "../components/NewsModal";
import { useNews } from "../hooks/useNews";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const INIT_COUNT = 6;

export default function News() {
  const [region, setRegion] = useState("norway");
  const [norCount, setNorCount] = useState(INIT_COUNT);
  const [intlCount, setIntlCount] = useState(INIT_COUNT);
  const [saved, setSaved] = useState(new Set());
  const [activeItem, setActiveItem] = useState(null);
  const { token } = useAuth();

  const { items: norAll, loading: norLoading, error: norError } = useNews("norway");
  const { items: intlAll, loading: intlLoading, error: intlError } = useNews("international");

  const norItems = (norAll || []).slice(0, norCount);
  const intlItems = (intlAll || []).slice(0, intlCount);
  const favItems = [...(norAll || []), ...(intlAll || [])]
    .filter((n) => saved.has(n.id))
    .filter((item, index, self) =>
      index === self.findIndex((t) => t.id === item.id)
    );
  const count = region === "norway" ? norCount : intlCount;

  const total = region === "norway" ? norAll.length : intlAll.length;
  const initCount = INIT_COUNT;
  const setCount = region === "norway" ? setNorCount : setIntlCount;

  const canShowMore = count < total;
  const canShowLess = count > initCount;

  const toggleStar = (item) => {
    const isSaved = saved.has(item.id);
    setSaved((prev) => {
      const next = new Set(prev);
      isSaved ? next.delete(item.id) : next.add(item.id);
      return next;
    });
    if (!token) return;
    fetch(`${API_URL}/api/auth/favorites/${item.id}`, {
      method: isSaved ? "DELETE" : "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  useEffect(() => {
    if (!token) {
      setSaved(new Set());
      return;
    }
    fetch(`${API_URL}/api/auth/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(ids => setSaved(new Set(ids)));
  }, [token]);


  return (
    <main className="news-page">
      <HeroSection heroImg="/assets/hero/ai-news.png">
        <p className="heroSection__intro--label">Latest Updates</p>
        <h1 className="heroSection__intro--title">AI News &amp; Highlights</h1>
        <p className="heroSection__intro--text">
          The latest in AI, tech and student opportunities — curated for HCAI.
        </p>
      </HeroSection>

      <section className="news-page__content">

        <div className="news-page__filter-bar" role="group" aria-label="Filter news by region">
          <button
            type="button"
            className={`btn btn--filter btn--filter--norway${region === "norway" ? " btn--filter--active" : ""}`}
            aria-pressed={region === "norway"}
            aria-label="Show Norway news"
            onClick={() => setRegion("norway")}
          >
            Norway
          </button>
          <button
            type="button"
            className={`btn btn--filter btn--filter--international${region === "international" ? " btn--filter--active" : ""}`}
            aria-pressed={region === "international"}
            aria-label="Show International news"
            onClick={() => setRegion("international")}
          >
            International
          </button>
        </div>

        <div className="news-page__layout">
          <div className="news-page__main">

            {/* Norway tab */}
            {region === "norway" && (
              <>
                {norLoading && (
                  <p className="news-page__status">Loading news...</p>
                )}
                {norError && (
                  <p className="news-page__status news-page__status--error">
                    Could not load: {norError}
                  </p>
                )}
                {!norLoading && !norError && norItems.length > 0 && (
                  <NewsRail
                    label="Norway"
                    items={norItems}
                    saved={saved}
                    token={token}
                    onStar={toggleStar}
                    onOpen={setActiveItem}
                  />
                )}
              </>
            )}

            {/* International tab */}
            {region === "international" && (
              <>
                {intlLoading && (
                  <p className="news-page__status">Loading news...</p>
                )}
                {intlError && (
                  <p className="news-page__status news-page__status--error">
                    Could not load: {intlError}
                  </p>
                )}
                {!intlLoading && !intlError && intlItems.length > 0 && (
                  <NewsRail
                    label="International"
                    items={intlItems}
                    saved={saved}
                    onStar={toggleStar}
                    onOpen={setActiveItem}
                    token={token}
                  />
                )}
              </>
            )}

            <div className="news-page__more" role="group" aria-label="Load more or fewer articles">
              {canShowLess && (
                <button
                  type="button"
                  className="btn btn--ghost"
                  aria-label="Show fewer articles"
                  onClick={() => setCount(initCount)}
                >
                  Show less
                </button>
              )}
              {canShowMore && (
                <button
                  type="button"
                  className="btn btn--ghost"
                  aria-label="Load 3 more articles"
                  onClick={() => setCount((c) => Math.min(c + 3, total))}
                >
                  More news
                </button>
              )}
            </div>
          </div>

          <NewsSidebar favItems={favItems} onOpen={setActiveItem} onStar={toggleStar} token={token} />        </div>
      </section>

      <NewsModal item={activeItem} onClose={() => setActiveItem(null)} />
    </main>
  );
}

