// src/pages/Admin.jsx
import { useState } from "react";
import HeroSection from "../components/HeroSection";
import AdminStatCard from "../components/AdminStatCard";
import { people } from "../data/peopleData";
import { projects } from "../data/projectsData";
import { events } from "../data/eventData";

const TABS = ["Overview", "People", "Projects", "Events"];

// Norway + International mock articles combined
const TOTAL_NEWS_ARTICLES = 18;

export default function Admin() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <main className="admin-page">
      <HeroSection heroImg="/assets/hero/hero-home.png">
        <p className="heroSection__intro--label">Dashboard</p>
        <h1 className="heroSection__intro--title">Admin</h1>
        <p className="heroSection__intro--text">
          Manage HCAI Lab content — people, projects, events, and more.
        </p>
      </HeroSection>

      <section className="admin-page__content">

        {/* Tab bar */}
        <div className="admin-page__tab-bar" role="tablist" aria-label="Admin sections">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={`admin-page__tab-btn${activeTab === tab ? " admin-page__tab-btn--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Overview ──────────────────────────────────────────────────── */}
        {activeTab === "Overview" && (
          <div className="admin-page__overview" role="tabpanel" aria-label="Overview">
            <div className="admin-page__stats">
              <AdminStatCard label="Members"  value={people.length}           icon="👥" />
              <AdminStatCard label="Projects" value={projects.length}          icon="🔬" />
              <AdminStatCard label="Events"   value={events.length}            icon="📅" />
              <AdminStatCard label="News"     value={TOTAL_NEWS_ARTICLES}      icon="📰" />
            </div>
          </div>
        )}

        {/* ── People ────────────────────────────────────────────────────── */}
        {activeTab === "People" && (
          <div className="admin-page__table-section" role="tabpanel" aria-label="People">
            <h2 className="admin-page__table-heading">
              Members <span className="admin-page__count">({people.length})</span>
            </h2>
            <div className="admin-page__table-wrap">
              <table className="admin-page__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {people.map((person) => (
                    <tr key={person.id}>
                      <td>{person.name}</td>
                      <td>
                        <span className="admin-page__role-badge">{person.role}</span>
                      </td>
                      <td>
                        <a
                          href={`mailto:${person.email}`}
                          className="admin-page__link"
                        >
                          {person.email}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Projects ──────────────────────────────────────────────────── */}
        {activeTab === "Projects" && (
          <div className="admin-page__table-section" role="tabpanel" aria-label="Projects">
            <h2 className="admin-page__table-heading">
              Projects <span className="admin-page__count">({projects.length})</span>
            </h2>
            <div className="admin-page__table-wrap">
              <table className="admin-page__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Tags</th>
                    <th>Team</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.name}</td>
                      <td>
                        <span
                          className={`admin-page__status-badge admin-page__status-badge--${project.status.toLowerCase()}`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td>{project.tags.join(", ")}</td>
                      <td className="admin-page__team-cell">{project.team.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Events ────────────────────────────────────────────────────── */}
        {activeTab === "Events" && (
          <div className="admin-page__table-section" role="tabpanel" aria-label="Events">
            <h2 className="admin-page__table-heading">
              Events <span className="admin-page__count">({events.length})</span>
            </h2>
            <div className="admin-page__table-wrap">
              <table className="admin-page__table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{event.date}</td>
                      <td>{event.place}</td>
                      <td className="admin-page__desc-cell">{event.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
