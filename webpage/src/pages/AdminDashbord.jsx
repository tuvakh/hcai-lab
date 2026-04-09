// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import AdminStatCard from "../components/AdminStatCard";
import { people } from "../data/peopleData";
import { events } from "../data/eventData";

const TABS = ["Overview", "People", "Projects", "Events"];
const TOTAL_NEWS_ARTICLES = 18;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const EMPTY_FORM = {
  name: "",
  status: [],
  tags: "",
  image: "",
  shortDescription: "",
  fullDescription: "",
  outcomes: "",
  links: "",
  team: "",
  year: new Date().getFullYear(),
};

const STATUS_OPTIONS = ["Ongoing", "Completed", "Student"];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  function fetchProjects() {
    fetch(`${API_URL}/api/projects`)
      .then((res) => res.json())
      .then(setProjects)
      .catch(() => setError("Could not load projects from backend."));
  }

  function handleStatusToggle(val) {
    setForm((f) => ({
      ...f,
      status: f.status.includes(val)
        ? f.status.filter((s) => s !== val)
        : [...f.status, val],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      team: form.team.split(",").map((t) => t.trim()).filter(Boolean),
      links: form.links
        ? [{ label: "Read more", url: form.links }]
        : [],
      year: Number(form.year),
    };

    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      await fetchProjects();
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch {
      setError("Failed to add project. Is the backend running?");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this project?")) return;
    try {
      await fetch(`${API_URL}/api/projects/${id}`, { method: "DELETE" });
      fetchProjects();
    } catch {
      setError("Failed to delete project.");
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <p className="admin-page__header--label">Dashboard</p>
        <h1 className="admin-page__header--title">Admin</h1>
      </header>

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
              <AdminStatCard label="Projects" value={projects.length}         icon="🔬" />
              <AdminStatCard label="Events"   value={events.length}           icon="📅" />
              <AdminStatCard label="News"     value={TOTAL_NEWS_ARTICLES}     icon="📰" />
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
                        <a href={`mailto:${person.email}`} className="admin-page__link">
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
            <div className="admin-page__section-header">
              <h2 className="admin-page__table-heading">
                Projects <span className="admin-page__count">({projects.length})</span>
              </h2>
              <button
                type="button"
                className="admin-page__add-btn"
                onClick={() => setShowForm((v) => !v)}
              >
                {showForm ? "Cancel" : "+ Add Project"}
              </button>
            </div>

            {error && <p className="admin-page__error">{error}</p>}

            {/* ── Add Project Form ─────────────────────────────────────── */}
            {showForm && (
              <form className="admin-page__form" onSubmit={handleSubmit}>
                <div className="admin-page__form-grid">
                  <div className="admin-page__form-group admin-page__form-group--full">
                    <label>Project Name *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. AI in Healthcare"
                    />
                  </div>

                  <div className="admin-page__form-group">
                    <label>Year</label>
                    <input
                      type="number"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      placeholder="2025"
                    />
                  </div>

                  <div className="admin-page__form-group">
                    <label>Status</label>
                    <div className="admin-page__checkbox-group">
                      {STATUS_OPTIONS.map((opt) => (
                        <label key={opt} className="admin-page__checkbox-label">
                          <input
                            type="checkbox"
                            checked={form.status.includes(opt)}
                            onChange={() => handleStatusToggle(opt)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="admin-page__form-group">
                    <label>Tags <span className="admin-page__hint">(comma separated)</span></label>
                    <input
                      value={form.tags}
                      onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      placeholder="AI, LLM, Education"
                    />
                  </div>

                  <div className="admin-page__form-group">
                    <label>Team Members <span className="admin-page__hint">(comma separated)</span></label>
                    <input
                      value={form.team}
                      onChange={(e) => setForm({ ...form, team: e.target.value })}
                      placeholder="John Doe, Jane Smith"
                    />
                  </div>

                  <div className="admin-page__form-group">
                    <label>Image path</label>
                    <input
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="/assets/projects/my-image.png"
                    />
                  </div>

                  <div className="admin-page__form-group">
                    <label>Link URL</label>
                    <input
                      value={form.links}
                      onChange={(e) => setForm({ ...form, links: e.target.value })}
                      placeholder="https://hdl.handle.net/..."
                    />
                  </div>

                  <div className="admin-page__form-group admin-page__form-group--full">
                    <label>Short Description</label>
                    <textarea
                      rows={2}
                      value={form.shortDescription}
                      onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                      placeholder="One or two sentences shown on the card"
                    />
                  </div>

                  <div className="admin-page__form-group admin-page__form-group--full">
                    <label>Full Description</label>
                    <textarea
                      rows={4}
                      value={form.fullDescription}
                      onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
                      placeholder="Full description shown in the modal"
                    />
                  </div>

                  <div className="admin-page__form-group admin-page__form-group--full">
                    <label>Outcomes</label>
                    <textarea
                      rows={2}
                      value={form.outcomes}
                      onChange={(e) => setForm({ ...form, outcomes: e.target.value })}
                      placeholder="Key findings or results"
                    />
                  </div>
                </div>

                <button type="submit" className="admin-page__submit-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Project"}
                </button>
              </form>
            )}

            {/* ── Projects table ───────────────────────────────────────── */}
            <div className="admin-page__table-wrap">
              <table className="admin-page__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th>Tags</th>
                    <th>Team</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.name}</td>
                      <td>{project.year}</td>
                      <td>
                        <div className="admin-page__badge-group">
                          {(Array.isArray(project.status) ? project.status : [project.status]).map((s) => (
                            <span
                              key={s}
                              className={`admin-page__status-badge admin-page__status-badge--${s.toLowerCase()}`}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{Array.isArray(project.tags) ? project.tags.join(", ") : project.tags}</td>
                      <td className="admin-page__team-cell">
                        {Array.isArray(project.team) ? project.team.join(", ") : project.team}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-page__delete-btn"
                          onClick={() => handleDelete(project.id)}
                        >
                          Delete
                        </button>
                      </td>
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
