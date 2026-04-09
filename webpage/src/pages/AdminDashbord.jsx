// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import AdminStatCard from "../components/AdminStatCard";
import { events } from "../data/eventData";

const TABS = ["Overview", "People", "Projects", "Events"];
const TOTAL_NEWS_ARTICLES = 18;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const EMPTY_PROJECT = {
  name: "", status: [], tags: "", image: "", shortDescription: "",
  fullDescription: "", outcomes: "", links: "", team: "", year: new Date().getFullYear(),
};

const EMPTY_PERSON = {
  name: "", role: "", email: "", image: "", shortDescription: "", fullBio: "",
  researchInterests: "", linkedin: "", twitter: "", scholar: "", researchgate: "",
  ntnuProfile: "", publicationsUrl: "",
};

const STATUS_OPTIONS = ["Ongoing", "Completed", "Student"];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("Overview");

  const [projects, setProjects] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);

  const [people, setPeople] = useState([]);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [personForm, setPersonForm] = useState(EMPTY_PERSON);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { fetchProjects(); fetchPeople(); }, []);

  function fetchProjects() {
    fetch(`${API_URL}/api/projects`)
      .then((r) => r.json()).then(setProjects)
      .catch(() => setError("Could not load projects from backend."));
  }

  function fetchPeople() {
    fetch(`${API_URL}/api/people`)
      .then((r) => r.json()).then(setPeople)
      .catch(() => setError("Could not load people from backend."));
  }

  function handleStatusToggle(val) {
    setProjectForm((f) => ({
      ...f,
      status: f.status.includes(val) ? f.status.filter((s) => s !== val) : [...f.status, val],
    }));
  }

  async function handleProjectSubmit(e) {
    e.preventDefault();
    setSaving(true); setError(null);
    const payload = {
      ...projectForm,
      tags: projectForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      team: projectForm.team.split(",").map((t) => t.trim()).filter(Boolean),
      links: projectForm.links ? [{ label: "Read more", url: projectForm.links }] : [],
      year: Number(projectForm.year),
    };
    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      fetchProjects();
      setProjectForm(EMPTY_PROJECT);
      setShowProjectForm(false);
    } catch { setError("Failed to add project. Is the backend running?"); }
    finally { setSaving(false); }
  }

  async function handleDeleteProject(id) {
    if (!window.confirm("Delete this project?")) return;
    try {
      await fetch(`${API_URL}/api/projects/${id}`, { method: "DELETE" });
      fetchProjects();
    } catch { setError("Failed to delete project."); }
  }

  async function handlePersonSubmit(e) {
    e.preventDefault();
    setSaving(true); setError(null);
    const payload = {
      ...personForm,
      researchInterests: personForm.researchInterests.split(",").map((t) => t.trim()).filter(Boolean),
      projects: [],
    };
    try {
      const res = await fetch(`${API_URL}/api/people`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      fetchPeople();
      setPersonForm(EMPTY_PERSON);
      setShowPersonForm(false);
    } catch { setError("Failed to add person. Is the backend running?"); }
    finally { setSaving(false); }
  }

  async function handleDeletePerson(id) {
    if (!window.confirm("Delete this person?")) return;
    try {
      await fetch(`${API_URL}/api/people/${id}`, { method: "DELETE" });
      fetchPeople();
    } catch { setError("Failed to delete person."); }
  }

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <p className="admin-page__header--label">Dashboard</p>
        <h1 className="admin-page__header--title">Admin</h1>
      </header>

      <section className="admin-page__content">

        <div className="admin-page__tab-bar" role="tablist" aria-label="Admin sections">
          {TABS.map((tab) => (
            <button key={tab} type="button" role="tab" aria-selected={activeTab === tab}
              className={`admin-page__tab-btn${activeTab === tab ? " admin-page__tab-btn--active" : ""}`}
              onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </div>

        {error && <p className="admin-page__error">{error}</p>}

        {/* ── Overview ──────────────────────────────────────────────────── */}
        {activeTab === "Overview" && (
          <div className="admin-page__overview" role="tabpanel">
            <div className="admin-page__stats">
              <AdminStatCard label="Members"  value={people.length}       icon="👥" />
              <AdminStatCard label="Projects" value={projects.length}     icon="🔬" />
              <AdminStatCard label="Events"   value={events.length}       icon="📅" />
              <AdminStatCard label="News"     value={TOTAL_NEWS_ARTICLES} icon="📰" />
            </div>
          </div>
        )}

        {/* ── People ────────────────────────────────────────────────────── */}
        {activeTab === "People" && (
          <div className="admin-page__table-section" role="tabpanel">
            <div className="admin-page__section-header">
              <h2 className="admin-page__table-heading">
                Members <span className="admin-page__count">({people.length})</span>
              </h2>
              <button type="button" className="admin-page__add-btn"
                onClick={() => setShowPersonForm((v) => !v)}>
                {showPersonForm ? "Cancel" : "+ Add Person"}
              </button>
            </div>

            {showPersonForm && (
              <form className="admin-page__form" onSubmit={handlePersonSubmit}>
                <div className="admin-page__form-grid">
                  <div className="admin-page__form-group admin-page__form-group--full">
                    <label>Full Name *</label>
                    <input required value={personForm.name}
                      onChange={(e) => setPersonForm({ ...personForm, name: e.target.value })}
                      placeholder="e.g. Jane Doe" />
                  </div>
                  <div className="admin-page__form-group">
                    <label>Role *</label>
                    <input required value={personForm.role}
                      onChange={(e) => setPersonForm({ ...personForm, role: e.target.value })}
                      placeholder="e.g. PhD Candidate" />
                  </div>
                  <div className="admin-page__form-group">
                    <label>Email</label>
                    <input type="email" value={personForm.email}
                      onChange={(e) => setPersonForm({ ...personForm, email: e.target.value })}
                      placeholder="name@ntnu.no" />
                  </div>
                  <div className="admin-page__form-group">
                    <label>Image path</label>
                    <input value={personForm.image}
                      onChange={(e) => setPersonForm({ ...personForm, image: e.target.value })}
                      placeholder="/assets/people/name.png" />
                  </div>
                  <div className="admin-page__form-group">
                    <label>NTNU Profile URL</label>
                    <input value={personForm.ntnuProfile}
                      onChange={(e) => setPersonForm({ ...personForm, ntnuProfile: e.target.value })}
                      placeholder="https://www.ntnu.edu/employees/..." />
                  </div>
                  <div className="admin-page__form-group">
                    <label>Publications URL</label>
                    <input value={personForm.publicationsUrl}
                      onChange={(e) => setPersonForm({ ...personForm, publicationsUrl: e.target.value })}
                      placeholder="https://www.ntnu.edu/employees/...#nav-publications" />
                  </div>
                  <div className="admin-page__form-group">
                    <label>LinkedIn</label>
                    <input value={personForm.linkedin}
                      onChange={(e) => setPersonForm({ ...personForm, linkedin: e.target.value })}
                      placeholder="https://www.linkedin.com/in/..." />
                  </div>
                  <div className="admin-page__form-group">
                    <label>Google Scholar</label>
                    <input value={personForm.scholar}
                      onChange={(e) => setPersonForm({ ...personForm, scholar: e.target.value })}
                      placeholder="https://scholar.google.com/..." />
                  </div>
                  <div className="admin-page__form-group">
                    <label>ResearchGate</label>
                    <input value={personForm.researchgate}
                      onChange={(e) => setPersonForm({ ...personForm, researchgate: e.target.value })}
                      placeholder="https://www.researchgate.net/..." />
                  </div>
                  <div className="admin-page__form-group">
                    <label>Twitter / X</label>
                    <input value={personForm.twitter}
                      onChange={(e) => setPersonForm({ ...personForm, twitter: e.target.value })}
                      placeholder="https://x.com/..." />
                  </div>
                  <div className="admin-page__form-group">
                    <label>Research Interests <span className="admin-page__hint">(comma separated)</span></label>
                    <input value={personForm.researchInterests}
                      onChange={(e) => setPersonForm({ ...personForm, researchInterests: e.target.value })}
                      placeholder="AI, HCI, Design" />
                  </div>
                  <div className="admin-page__form-group admin-page__form-group--full">
                    <label>Short Description</label>
                    <textarea rows={2} value={personForm.shortDescription}
                      onChange={(e) => setPersonForm({ ...personForm, shortDescription: e.target.value })}
                      placeholder="One or two sentences shown on the card" />
                  </div>
                  <div className="admin-page__form-group admin-page__form-group--full">
                    <label>Full Bio</label>
                    <textarea rows={4} value={personForm.fullBio}
                      onChange={(e) => setPersonForm({ ...personForm, fullBio: e.target.value })}
                      placeholder="Full biography shown in the modal" />
                  </div>
                </div>
                <button type="submit" className="admin-page__submit-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Person"}
                </button>
              </form>
            )}

            <div className="admin-page__table-wrap">
              <table className="admin-page__table">
                <thead>
                  <tr><th>Name</th><th>Role</th><th>Email</th><th></th></tr>
                </thead>
                <tbody>
                  {people.map((person) => (
                    <tr key={person.id}>
                      <td>{person.name}</td>
                      <td><span className="admin-page__role-badge">{person.role}</span></td>
                      <td>
                        <a href={`mailto:${person.email}`} className="admin-page__link">
                          {person.email}
                        </a>
                      </td>
                      <td>
                        <button type="button" className="admin-page__delete-btn"
                          onClick={() => handleDeletePerson(person.id)}>
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

        {/* ── Projects ──────────────────────────────────────────────────── */}
        {activeTab === "Projects" && (
          <div className="admin-page__table-section" role="tabpanel">
            <div className="admin-page__section-header">
              <h2 className="admin-page__table-heading">
                Projects <span className="admin-page__count">({projects.length})</span>
              </h2>
              <button type="button" className="admin-page__add-btn"
                onClick={() => setShowProjectForm((v) => !v)}>
                {showProjectForm ? "Cancel" : "+ Add Project"}
              </button>
            </div>

            {showProjectForm && (
              <form className="admin-page__form" onSubmit={handleProjectSubmit}>
                <div className="admin-page__form-grid">
                  <div className="admin-page__form-group admin-page__form-group--full">
                    <label>Project Name *</label>
                    <input required value={projectForm.name}
                      onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      placeholder="e.g. AI in Healthcare" />
                  </div>
                  <div className="admin-page__form-group">
                    <label>Year</label>
                    <input type="number" value={projectForm.year}
                      onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })}
                      placeholder="2025" />
                  </div>
                  <div className="admin-page__form-group">
                    <label>Status</label>
                    <div className="admin-page__checkbox-group">
                      {STATUS_OPTIONS.map((opt) => (
                        <label key={opt} className="admin-page__checkbox-label">
                          <input type="checkbox" checked={projectForm.status.includes(opt)}
                            onChange={() => handleStatusToggle(opt)} />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="admin-page__form-group">
                    <label>Tags <span className="admin-page__hint">(comma separated)</span></label>
                    <input value={projectForm.tags}
                      onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                      placeholder="AI, LLM, Education" />
                  </div>
                  <div className="admin-page__form-group">
                    <label>Team Members <span className="admin-page__hint">(comma separated)</span></label>
                    <input value={projectForm.team}
                      onChange={(e) => setProjectForm({ ...projectForm, team: e.target.value })}
                      placeholder="John Doe, Jane Smith" />
                  </div>
                  <div className="admin-page__form-group">
                    <label>Image path</label>
                    <input value={projectForm.image}
                      onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                      placeholder="/assets/projects/my-image.png" />
                  </div>
                  <div className="admin-page__form-group">
                    <label>Link URL</label>
                    <input value={projectForm.links}
                      onChange={(e) => setProjectForm({ ...projectForm, links: e.target.value })}
                      placeholder="https://hdl.handle.net/..." />
                  </div>
                  <div className="admin-page__form-group admin-page__form-group--full">
                    <label>Short Description</label>
                    <textarea rows={2} value={projectForm.shortDescription}
                      onChange={(e) => setProjectForm({ ...projectForm, shortDescription: e.target.value })}
                      placeholder="One or two sentences shown on the card" />
                  </div>
                  <div className="admin-page__form-group admin-page__form-group--full">
                    <label>Full Description</label>
                    <textarea rows={4} value={projectForm.fullDescription}
                      onChange={(e) => setProjectForm({ ...projectForm, fullDescription: e.target.value })}
                      placeholder="Full description shown in the modal" />
                  </div>
                  <div className="admin-page__form-group admin-page__form-group--full">
                    <label>Outcomes</label>
                    <textarea rows={2} value={projectForm.outcomes}
                      onChange={(e) => setProjectForm({ ...projectForm, outcomes: e.target.value })}
                      placeholder="Key findings or results" />
                  </div>
                </div>
                <button type="submit" className="admin-page__submit-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Project"}
                </button>
              </form>
            )}

            <div className="admin-page__table-wrap">
              <table className="admin-page__table">
                <thead>
                  <tr><th>Name</th><th>Year</th><th>Status</th><th>Tags</th><th>Team</th><th></th></tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.name}</td>
                      <td>{project.year}</td>
                      <td>
                        <div className="admin-page__badge-group">
                          {(Array.isArray(project.status) ? project.status : [project.status]).map((s) => (
                            <span key={s} className={`admin-page__status-badge admin-page__status-badge--${s.toLowerCase()}`}>{s}</span>
                          ))}
                        </div>
                      </td>
                      <td>{Array.isArray(project.tags) ? project.tags.join(", ") : project.tags}</td>
                      <td className="admin-page__team-cell">
                        {Array.isArray(project.team) ? project.team.join(", ") : project.team}
                      </td>
                      <td>
                        <button type="button" className="admin-page__delete-btn"
                          onClick={() => handleDeleteProject(project.id)}>
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
          <div className="admin-page__table-section" role="tabpanel">
            <h2 className="admin-page__table-heading">
              Events <span className="admin-page__count">({events.length})</span>
            </h2>
            <div className="admin-page__table-wrap">
              <table className="admin-page__table">
                <thead>
                  <tr><th>Title</th><th>Date</th><th>Location</th><th>Description</th></tr>
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
