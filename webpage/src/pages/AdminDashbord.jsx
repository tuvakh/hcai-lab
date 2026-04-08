// src/pages/AdminDashbord.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminStatCard from "../components/AdminStatCard";
import { people as initialPeople } from "../data/peopleData";
import { projects as initialProjects } from "../data/projectsData";
import { events as initialEvents } from "../data/eventData";

const TOTAL_NEWS_ARTICLES = 18;

const PEOPLE_FIELDS = [
  { key: "name",  label: "Name",  type: "text" },
  { key: "role",  label: "Role",  type: "text" },
  { key: "email", label: "Email", type: "text" },
];

const PROJECT_FIELDS = [
  { key: "name",   label: "Name",                     type: "text",   },
  { key: "status", label: "Status (comma-separated)", type: "text",   isArray: true },
  { key: "tags",   label: "Tags (comma-separated)",   type: "text",   isArray: true },
  { key: "team",   label: "Team (comma-separated)",   type: "text",   isArray: true },
  { key: "year",   label: "Year",                     type: "number" },
];

const EVENT_FIELDS = [
  { key: "title",       label: "Title",       type: "text"     },
  { key: "date",        label: "Date",        type: "text"     },
  { key: "place",       label: "Location",    type: "text"     },
  { key: "description", label: "Description", type: "textarea" },
];

// ─── Edit / Add Modal ─────────────────────────────────────────────────────────
function EditModal({ fields, data, onSave, onClose, title }) {
  const [form, setForm] = useState(() => {
    const init = {};
    fields.forEach((f) => {
      init[f.key] = f.isArray
        ? (data?.[f.key] ?? []).join(", ")
        : data?.[f.key] ?? "";
    });
    return init;
  });

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const out = {};
    fields.forEach((f) => {
      if (f.isArray) {
        out[f.key] = form[f.key].split(",").map((s) => s.trim()).filter(Boolean);
      } else if (f.type === "number") {
        out[f.key] = Number(form[f.key]);
      } else {
        out[f.key] = form[f.key];
      }
    });
    onSave(out);
  }

  return (
    <div className="admin-modal" role="dialog" aria-modal="true">
      <div className="admin-modal__box">
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">{title}</h2>
          <button className="admin-modal__close" onClick={onClose} type="button" aria-label="Close">
            &times;
          </button>
        </div>
        <form className="admin-modal__form" onSubmit={handleSubmit}>
          {fields.map((f) => (
            <div className="admin-modal__field" key={f.key}>
              <label className="admin-modal__label" htmlFor={`field-${f.key}`}>
                {f.label}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  id={`field-${f.key}`}
                  className="admin-modal__textarea"
                  value={form[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  rows={3}
                />
              ) : (
                <input
                  id={`field-${f.key}`}
                  className="admin-modal__input"
                  type={f.type}
                  value={form[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                />
              )}
            </div>
          ))}
          <div className="admin-modal__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-btn admin-btn--primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
  const [view, setView]           = useState("overview");
  const [people, setPeople]       = useState(initialPeople);
  const [projects, setProjects]   = useState(initialProjects);
  const [events, setEvents]       = useState(initialEvents);
  const [modal, setModal]         = useState(null);
  const [showLogout, setShowLogout] = useState(false);

  const dragIndex = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // ── Drag helpers ────────────────────────────────────────────────────────────
  function reorder(list, from, to) {
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
  }

  function makeDrag(setter, list) {
    return {
      start: (i) => { dragIndex.current = i; },
      over:  (e, i) => { e.preventDefault(); setDragOverIndex(i); },
      drop:  (i) => {
        if (dragIndex.current !== null && dragIndex.current !== i) {
          setter(reorder(list, dragIndex.current, i));
        }
        dragIndex.current = null;
        setDragOverIndex(null);
      },
      end: () => { dragIndex.current = null; setDragOverIndex(null); },
    };
  }

  // ── People CRUD ─────────────────────────────────────────────────────────────
  const pd = makeDrag(setPeople, people);

  function savePerson(data, index) {
    if (index === null) {
      setPeople((prev) => [
        ...prev,
        { id: Date.now(), image: null, shortDescription: "", fullBio: "", researchInterests: [], projects: [], ...data },
      ]);
    } else {
      setPeople((prev) => prev.map((p, i) => (i === index ? { ...p, ...data } : p)));
    }
    setModal(null);
  }

  function deletePerson(index) {
    if (!window.confirm("Remove this member?")) return;
    setPeople((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Projects CRUD ───────────────────────────────────────────────────────────
  const prjd = makeDrag(setProjects, projects);

  function saveProject(data, index) {
    if (index === null) {
      setProjects((prev) => [
        ...prev,
        { id: Date.now(), image: null, shortDescription: "", fullDescription: "", outcomes: "", links: [], presentationUrl: null, ...data },
      ]);
    } else {
      setProjects((prev) => prev.map((p, i) => (i === index ? { ...p, ...data } : p)));
    }
    setModal(null);
  }

  function deleteProject(index) {
    if (!window.confirm("Remove this project?")) return;
    setProjects((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Events CRUD ─────────────────────────────────────────────────────────────
  const evd = makeDrag(setEvents, events);

  function saveEvent(data, index) {
    if (index === null) {
      setEvents((prev) => [...prev, { id: Date.now(), eventImg: null, ...data }]);
    } else {
      setEvents((prev) => prev.map((e, i) => (i === index ? { ...e, ...data } : e)));
    }
    setModal(null);
  }

  function deleteEvent(index) {
    if (!window.confirm("Remove this event?")) return;
    setEvents((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Section label for the header ────────────────────────────────────────────
  const sectionLabel = {
    people:   "Members",
    projects: "Projects",
    events:   "Events",
  }[view] ?? null;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <main className="admin-page">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <header className="admin-page__header">
        <div className="admin-page__header-left">
          {view !== "overview" && (
            <button
              className="admin-btn admin-btn--ghost admin-btn--back"
              onClick={() => setView("overview")}
              type="button"
            >
              ← Back
            </button>
          )}
          <div>
            <p className="admin-page__header--label">
              {view === "overview" ? "Dashboard" : "Dashboard / " + sectionLabel}
            </p>
            <h1 className="admin-page__header--title">
              {view === "overview" ? "Admin" : sectionLabel}
            </h1>
          </div>
        </div>

        <button
          className="admin-btn admin-btn--ghost admin-btn--logout"
          onClick={() => setShowLogout(true)}
          type="button"
        >
          Log out
        </button>
      </header>

      <section className="admin-page__content">

        {/* ── Overview — clickable stat cards ─────────────────────────────── */}
        {view === "overview" && (
          <div className="admin-page__overview" role="main">
            <div className="admin-page__stats">
              <AdminStatCard
                label="Members"
                value={people.length}
                description="Manage team members"
                onClick={() => setView("people")}
              />
              <AdminStatCard
                label="Projects"
                value={projects.length}
                description="Manage research projects"
                onClick={() => setView("projects")}
              />
              <AdminStatCard
                label="Events"
                value={events.length}
                description="Manage upcoming events"
                onClick={() => setView("events")}
              />
              <AdminStatCard
                label="News"
                value={TOTAL_NEWS_ARTICLES}
                description="Total published articles"
              />
            </div>
          </div>
        )}

        {/* ── People ──────────────────────────────────────────────────────── */}
        {view === "people" && (
          <div className="admin-page__table-section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__table-heading">
                Members <span className="admin-page__count">({people.length})</span>
              </h2>
              <button
                className="admin-btn admin-btn--primary"
                onClick={() => setModal({ type: "people", item: null, index: null })}
              >
                Add Member
              </button>
            </div>
            <div className="admin-page__table-wrap">
              <table className="admin-page__table">
                <thead>
                  <tr>
                    <th className="admin-page__drag-col" aria-label="Drag handle"></th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th className="admin-page__action-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {people.map((person, i) => (
                    <tr
                      key={person.id}
                      draggable
                      onDragStart={() => pd.start(i)}
                      onDragOver={(e) => pd.over(e, i)}
                      onDrop={() => pd.drop(i)}
                      onDragEnd={pd.end}
                      className={dragOverIndex === i && dragIndex.current !== i ? "admin-page__row--drag-over" : ""}
                    >
                      <td className="admin-page__drag-handle" title="Drag to reorder">&#8942;</td>
                      <td>{person.name}</td>
                      <td><span className="admin-page__role-badge">{person.role}</span></td>
                      <td>
                        <a href={`mailto:${person.email}`} className="admin-page__link">
                          {person.email}
                        </a>
                      </td>
                      <td className="admin-page__actions-cell">
                        <button
                          className="admin-btn admin-btn--sm admin-btn--ghost"
                          onClick={() => setModal({ type: "people", item: person, index: i })}
                        >Edit</button>
                        <button
                          className="admin-btn admin-btn--sm admin-btn--danger"
                          onClick={() => deletePerson(i)}
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Projects ────────────────────────────────────────────────────── */}
        {view === "projects" && (
          <div className="admin-page__table-section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__table-heading">
                Projects <span className="admin-page__count">({projects.length})</span>
              </h2>
              <button
                className="admin-btn admin-btn--primary"
                onClick={() => setModal({ type: "projects", item: null, index: null })}
              >
                Add Project
              </button>
            </div>
            <div className="admin-page__table-wrap">
              <table className="admin-page__table">
                <thead>
                  <tr>
                    <th className="admin-page__drag-col" aria-label="Drag handle"></th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Tags</th>
                    <th>Team</th>
                    <th className="admin-page__action-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project, i) => (
                    <tr
                      key={project.id}
                      draggable
                      onDragStart={() => prjd.start(i)}
                      onDragOver={(e) => prjd.over(e, i)}
                      onDrop={() => prjd.drop(i)}
                      onDragEnd={prjd.end}
                      className={dragOverIndex === i && dragIndex.current !== i ? "admin-page__row--drag-over" : ""}
                    >
                      <td className="admin-page__drag-handle" title="Drag to reorder">&#8942;</td>
                      <td>{project.name}</td>
                      <td>
                        <div className="admin-page__status-badges">
                          {[].concat(project.status).map((s) => (
                            <span
                              key={s}
                              className={`admin-page__status-badge admin-page__status-badge--${s.toLowerCase()}`}
                            >{s}</span>
                          ))}
                        </div>
                      </td>
                      <td>{project.tags.join(", ")}</td>
                      <td className="admin-page__team-cell">{project.team.join(", ")}</td>
                      <td className="admin-page__actions-cell">
                        <button
                          className="admin-btn admin-btn--sm admin-btn--ghost"
                          onClick={() => setModal({ type: "projects", item: project, index: i })}
                        >Edit</button>
                        <button
                          className="admin-btn admin-btn--sm admin-btn--danger"
                          onClick={() => deleteProject(i)}
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Events ──────────────────────────────────────────────────────── */}
        {view === "events" && (
          <div className="admin-page__table-section">
            <div className="admin-page__section-header">
              <h2 className="admin-page__table-heading">
                Events <span className="admin-page__count">({events.length})</span>
              </h2>
              <button
                className="admin-btn admin-btn--primary"
                onClick={() => setModal({ type: "events", item: null, index: null })}
              >
                Add Event
              </button>
            </div>
            <div className="admin-page__table-wrap">
              <table className="admin-page__table">
                <thead>
                  <tr>
                    <th className="admin-page__drag-col" aria-label="Drag handle"></th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Description</th>
                    <th className="admin-page__action-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, i) => (
                    <tr
                      key={event.id}
                      draggable
                      onDragStart={() => evd.start(i)}
                      onDragOver={(e) => evd.over(e, i)}
                      onDrop={() => evd.drop(i)}
                      onDragEnd={evd.end}
                      className={dragOverIndex === i && dragIndex.current !== i ? "admin-page__row--drag-over" : ""}
                    >
                      <td className="admin-page__drag-handle" title="Drag to reorder">&#8942;</td>
                      <td>{event.title}</td>
                      <td>{event.date}</td>
                      <td>{event.place}</td>
                      <td className="admin-page__desc-cell">{event.description}</td>
                      <td className="admin-page__actions-cell">
                        <button
                          className="admin-btn admin-btn--sm admin-btn--ghost"
                          onClick={() => setModal({ type: "events", item: event, index: i })}
                        >Edit</button>
                        <button
                          className="admin-btn admin-btn--sm admin-btn--danger"
                          onClick={() => deleteEvent(i)}
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </section>

      {/* ── Edit / Add Modal ────────────────────────────────────────────────── */}
      {modal?.type === "people" && (
        <EditModal
          title={modal.item ? "Edit Member" : "Add Member"}
          fields={PEOPLE_FIELDS}
          data={modal.item}
          onSave={(data) => savePerson(data, modal.index)}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "projects" && (
        <EditModal
          title={modal.item ? "Edit Project" : "Add Project"}
          fields={PROJECT_FIELDS}
          data={modal.item}
          onSave={(data) => saveProject(data, modal.index)}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "events" && (
        <EditModal
          title={modal.item ? "Edit Event" : "Add Event"}
          fields={EVENT_FIELDS}
          data={modal.item}
          onSave={(data) => saveEvent(data, modal.index)}
          onClose={() => setModal(null)}
        />
      )}

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
