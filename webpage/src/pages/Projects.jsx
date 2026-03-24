import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import CardGrid from "../components/CardGrid";
import { projects } from "../data/projectsData";

const FILTERS = ["All", "Ongoing", "Completed", "Student"];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) =>
          Array.isArray(p.status) ? p.status.includes(activeFilter) : p.status === activeFilter
        );

  return (
    <main className="projects-page">
      <HeroSection heroImg="/assets/hero/hero-home.png">
        <p className="heroSection__intro--label">Research</p>
        <h1 className="heroSection__intro--title">Projects</h1>
        <p className="heroSection__intro--text">
          Exploring the intersection of human-centred design and artificial
          intelligence through applied research and industry collaboration.
        </p>
      </HeroSection>

      <section className="projects-page__content">
        {/* Filter bar */}
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

        {/* Card grid — reusing existing CardGrid with projects variant */}
        <CardGrid items={filtered} variant="projects" />
      </section>
    </main>
  );
}
