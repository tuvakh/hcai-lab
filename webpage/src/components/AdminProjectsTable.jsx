// src/components/AdminProjectsTable.jsx
import { useRef, useState } from "react";
import AdminEditModal from "./AdminEditModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const PROJECT_FIELDS = [
  { key: "name",             label: "Project Name",                      type: "text",     required: true},
  { key: "year",             label: "Year",                              type: "number",   required: true},
  { key: "status",           label: "Status (comma-separated)",          type: "checkboxes",    options: ["Ongoing", "Completed", "Student"], isArray: false, required: true},
  { key: "tags",             label: "Tags (comma-separated)",            type: "text",    isArray: true },
  { key: "team",             label: "Team (comma-separated)",            type: "text",    isArray: true },
  { key: "image",            label: "Image path",                        type: "text",    required: true},
  { key: "links",            label: "Link URL",                          type: "text"     },
  { key: "shortDescription", label: "Short Description",                 type: "textarea", required: true },
  { key: "fullDescription",  label: "Full Description",                  type: "textarea" },
  { key: "outcomes",         label: "Outcomes",                          type: "textarea" },
];

export default function AdminProjectsTable({ projects, setProjects }) {
  const [modal, setModal] = useState(null);
  const dragIndex = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  function reorder(list, from, to) {
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
  }

  const drag = {
    start: (i) => { dragIndex.current = i; },
    over:  (e, i) => { e.preventDefault(); setDragOverIndex(i); },
    drop:  (i) => {
      if (dragIndex.current !== null && dragIndex.current !== i) {
        setProjects(reorder(projects, dragIndex.current, i));
      }
      dragIndex.current = null;
      setDragOverIndex(null);
    },
    end: () => { dragIndex.current = null; setDragOverIndex(null); },
  };

  async function saveProject(data, index) {
    const payload = {
    ...data,
    links: data.links ? [{ label: "Read more", url: data.links }] : [],
  };
  if (index === null) {
    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const saved = await res.json();
      setProjects((prev) => [...prev, saved]);
    } catch {
      setProjects((prev) => [...prev, { id: Date.now(), ...data }]);
    }
  } else {
    const project = projects[index];
    try {
      const res = await fetch(`${API_URL}/api/projects/${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const saved = await res.json();
      setProjects((prev) => prev.map((e, i) => (i === index ? saved : e)));
    } catch {
      setProjects((prev) => prev.map((e, i) => (i === index ? { ...e, ...data } : e)));
    }
  }
  setModal(null);
}


  async function deleteProject(index) {
    if (!window.confirm("Remove this project?")) return;
    const project = projects[index];
    setProjects((prev) => prev.filter((_, i) => i !== index));
    fetch(`${API_URL}/api/projects/${project._id}`, { method: "DELETE" }).catch(() => { });
}

  return (
    <div className="admin-page__table-section">
      <div className="admin-page__section-header">
        <h2 className="admin-page__table-heading">
          Projects <span className="admin-page__count">({projects.length})</span>
        </h2>
        <button
          className="admin-btn admin-btn--primary"
          onClick={() => setModal({ item: null, index: null })}
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
                onDragStart={() => drag.start(i)}
                onDragOver={(e) => drag.over(e, i)}
                onDrop={() => drag.drop(i)}
                onDragEnd={drag.end}
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
                    onClick={() => setModal({ item: { ...project, links: project.links?.[0]?.url ?? "" }, index: i })}
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

      {modal && (
        <AdminEditModal
          title={modal.item ? "Edit Project" : "Add Project"}
          fields={PROJECT_FIELDS}
          data={modal.item}
          onSave={(data) => saveProject(data, modal.index)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
