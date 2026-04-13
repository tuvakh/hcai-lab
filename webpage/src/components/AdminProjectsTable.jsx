// src/components/AdminProjectsTable.jsx
import { useRef, useState } from "react";
import AdminEditModal from "./AdminEditModal";

const PROJECT_FIELDS = [
  { key: "name",   label: "Name",                     type: "text"   },
  { key: "status", label: "Status (comma-separated)", type: "text",  isArray: true },
  { key: "tags",   label: "Tags (comma-separated)",   type: "text",  isArray: true },
  { key: "team",   label: "Team (comma-separated)",   type: "text",  isArray: true },
  { key: "year",   label: "Year",                     type: "number" },
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
                    onClick={() => setModal({ item: project, index: i })}
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
