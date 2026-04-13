// src/pages/AdminDashbord.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminStatCard from "../components/AdminStatCard";
import AdminPeopleTable from "../components/AdminPeopleTable";
import AdminProjectsTable from "../components/AdminProjectsTable";
import AdminEventsTable from "../components/AdminEventsTable";
import { people as initialPeople } from "../data/peopleData";
import { projects as initialProjects } from "../data/projectsData";
import { events as initialEvents } from "../data/eventData";

const TOTAL_NEWS_ARTICLES = 18;

// ─── Logout Confirm Modal ─────────────────────────────────────────────────────
function LogoutModal({ onConfirm, onClose }) {
  return (
    <div className="admin-modal" role="dialog" aria-modal="true">
      <div className="admin-modal__box admin-modal__box--sm">
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">Log out</h2>
          <button className="admin-modal__close" onClick={onClose} type="button" aria-label="Close">
            &times;
          </button>
        </div>
        <p className="admin-modal__body-text">Are you sure you want to log out of the admin dashboard?</p>
        <div className="admin-modal__actions">
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="admin-btn admin-btn--danger" onClick={onConfirm}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Admin() {
  const navigate = useNavigate();
  const [view, setView]             = useState("overview");
  const [people, setPeople]         = useState(initialPeople);
  const [projects, setProjects]     = useState(initialProjects);
  const [events, setEvents]         = useState(initialEvents);
  const [showLogout, setShowLogout] = useState(false);

  const sectionLabel = {
    people:   "Members",
    projects: "Projects",
    events:   "Events",
  }[view] ?? null;

  return (
    <main className="admin-page">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <header className="admin-page__header">
        <div className="admin-page__header-controls">
          <button
            className="admin-btn admin-btn--ghost"
            onClick={() => setShowLogout(true)}
            type="button"
          >
            Log out
          </button>
          {view !== "overview" && (
            <button
              className="admin-btn admin-btn--ghost admin-btn--back"
              onClick={() => setView("overview")}
              type="button"
            >
              &larr; Overview
            </button>
          )}
        </div>

        <div className="admin-page__header-info">
          <p className="admin-page__header--label">
            {view === "overview" ? "Dashboard" : "Dashboard / " + sectionLabel}
          </p>
          <h1 className="admin-page__header--title">
            {view === "overview" ? "Admin" : sectionLabel}
          </h1>
        </div>
      </header>

      <section className="admin-page__content">

        {/* ── Overview — stat cards ────────────────────────────────────────── */}
        {view === "overview" && (
          <div className="admin-page__overview">
            <div className="admin-page__stats">
              <AdminStatCard
                label="Members"
                value={people.length}
                description="Add, edit, and reorder team members. Drag rows to change display order."
                onClick={() => setView("people")}
              />
              <AdminStatCard
                label="Projects"
                value={projects.length}
                description="Manage research projects, update status, tags, and team assignments."
                onClick={() => setView("projects")}
              />
              <AdminStatCard
                label="Events"
                value={events.length}
                description="Schedule and manage upcoming events, workshops, and public talks."
                onClick={() => setView("events")}
              />
              <AdminStatCard
                label="News"
                value={TOTAL_NEWS_ARTICLES}
                description="Total published articles across all news categories."
              />
            </div>
          </div>
        )}

        {/* ── People ──────────────────────────────────────────────────────── */}
        {view === "people" && (
          <AdminPeopleTable people={people} setPeople={setPeople} />
        )}

        {/* ── Projects ────────────────────────────────────────────────────── */}
        {view === "projects" && (
          <AdminProjectsTable projects={projects} setProjects={setProjects} />
        )}

        {/* ── Events ──────────────────────────────────────────────────────── */}
        {view === "events" && (
          <AdminEventsTable events={events} setEvents={setEvents} />
        )}

      </section>

      {/* ── Logout Confirm ──────────────────────────────────────────────────── */}
      {showLogout && (
        <LogoutModal
          onConfirm={() => navigate("/")}
          onClose={() => setShowLogout(false)}
        />
      )}
    </main>
  );
}
