import { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import CardGrid from "../components/CardGrid";

const FILTERS = ["All", "Ongoing", "Completed", "Student"];
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error("Failed to fetch projects:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) =>
          Array.isArray(p.status) ? p.status.includes(activeFilter) : p.status === activeFilter
        );

  return (
    <main className="projects-page">
      <HeroSection heroImg="/assets/hero/project-hero.jpg">
        <p className="heroSection__intro--label">Research</p>
        <h1 className="heroSection__intro--title">Projects</h1>
        <p className="heroSection__intro--text">
          Exploring the intersection of human-centred design and artificial
          intelligence through applied research and industry collaboration.
        </p>
      </HeroSection>

      <section className="projects-page__content">
        <div className="projects-page__filter-bar">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`projects-page__filter-btn${activeFilter === f ? " projects-page__filter-btn--active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="projects-page__loading">Loading projects...</p>
        ) : (
          <CardGrid items={filtered} variant="projects" />
        )}
      </section>
    </main>
  );
}
