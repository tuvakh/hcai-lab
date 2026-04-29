// src/components/AdminProjectsTable.jsx
import { useRef, useState } from "react";
import AdminEditModal from "./AdminEditModal";
import AdminSearch from "./AdminSearch";
import Tag from './Tags';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const PROJECT_FIELDS = [
  { key: "name",             label: "Project Name",                      type: "text",     required: true, placeholder: "e.g. AI in Healthcare" },
  { key: "year",             label: "Year",                              type: "number",   required: true, placeholder: "e.g. 2024" },
  { key: "status",           label: "Status (comma-separated)",          type: "checkboxes",    options: ["Ongoing", "Completed", "Student"], isArray: false, required: true},
  { key: "tags",             label: "Tags (comma-separated)",            type: "text",    isArray: true, placeholder: "e.g. AI, HCI, Ethics" },
  { key: "team",             label: "Team (comma-separated)",            type: "text",    isArray: true, placeholder: "e.g. Name1, Name2" },
  { key: "image",            label: "Image path",                        type: "text",    required: true, folder: "projects" },
  { key: "links",            label: "Link URL",                          type: "text",    placeholder: "https://..." },
  { key: "shortDescription", label: "Short Description",                 type: "textarea", required: true, placeholder: "Brief summary visible on the projects page" },
  { key: "fullDescription",  label: "Full Description",                  type: "textarea", placeholder: "Extended description shown in the project modal" },
  { key: "outcomes",         label: "Outcomes",                          type: "textarea", placeholder: "Key findings or results" },
];

export default function AdminProjectsTable({ projects, setProjects }) {
  const [modal, setModal] = useState(null);
  const dragIndex = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [cristinModal, setCristinModal] = useState(false);

  function reorder(list, from, to) {
    const next = [...list];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
  }

  const drag = {
    start: (i) => { dragIndex.current = i; },
    over:  (event, i) => { event.preventDefault(); setDragOverIndex(i); },
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
      setProjects((prev) => prev.map((event, i) => (i === index ? saved : event)));
    } catch {
      setProjects((prev) => prev.map((event, i) => (i === index ? { ...event, ...data } : event)));
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
        <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="btn btn--primary" onClick={() => setModal({ item: null, index: null })}>
                Add Project
            </button>
            <button className="btn btn--primary" onClick={() => setCristinModal(true)}>
                Import Project
            </button>
        </div>
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
                onDragOver={(event) => drag.over(event, i)}
                onDrop={() => drag.drop(i)}
                onDragEnd={drag.end}
                className={dragOverIndex === i && dragIndex.current !== i ? "admin-page__row--drag-over" : ""}
              >
                <td className="admin-page__drag-handle" title="Drag to reorder">&#8942;</td>
                <td>{project.name}</td>
                <td>
                  <div className="admin-page__status-badges">
                    {[].concat(project.status).map((status) => (
                        <Tag key={status} status={status.toLowerCase()}>{status}</Tag>
                    ))}
                  </div>
                </td>
                <td>{project.tags.join(", ")}</td>
                <td className="admin-page__team-cell">{project.team.join(", ")}</td>
                <td className="admin-page__actions-cell">
                  <button
                    className="btn btn--secondary btn--small"
                    onClick={() => setModal({ item: { ...project, links: project.links?.[0]?.url ?? "" }, index: i })}
                  >Edit</button>
                  <button
                    className="btn btn--delete btn--small"
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
      {cristinModal && (
        <AdminSearch
            type="project"
            onClose={() => setCristinModal(false)}
            onSelect={(prefilled) => setModal({ item: prefilled, index: null })}
        />
       )}
    </div>
  );
}
