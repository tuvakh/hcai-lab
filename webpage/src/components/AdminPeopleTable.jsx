// src/components/AdminPeopleTable.jsx
import { useRef, useState } from "react";
import AdminEditModal from "./AdminEditModal";

const PEOPLE_FIELDS = [
  { key: "name",  label: "Name",  type: "text" },
  { key: "role",  label: "Role",  type: "text" },
  { key: "email", label: "Email", type: "text" },
];

export default function AdminPeopleTable({ people, setPeople }) {
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
        setPeople(reorder(people, dragIndex.current, i));
      }
      dragIndex.current = null;
      setDragOverIndex(null);
    },
    end: () => { dragIndex.current = null; setDragOverIndex(null); },
  };

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

  return (
    <div className="admin-page__table-section">
      <div className="admin-page__section-header">
        <h2 className="admin-page__table-heading">
          Members <span className="admin-page__count">({people.length})</span>
        </h2>
        <button
          className="admin-btn admin-btn--primary"
          onClick={() => setModal({ item: null, index: null })}
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
                onDragStart={() => drag.start(i)}
                onDragOver={(e) => drag.over(e, i)}
                onDrop={() => drag.drop(i)}
                onDragEnd={drag.end}
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
                    onClick={() => setModal({ item: person, index: i })}
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

      {modal && (
        <AdminEditModal
          title={modal.item ? "Edit Member" : "Add Member"}
          fields={PEOPLE_FIELDS}
          data={modal.item}
          onSave={(data) => savePerson(data, modal.index)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
