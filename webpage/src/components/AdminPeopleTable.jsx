// src/components/AdminPeopleTable.jsx
import { useRef, useState } from "react";
import AdminEditModal from "./AdminEditModal";
import AdminSearch from "./AdminSearch";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const PEOPLE_FIELDS = [
    { key: "name", label: "Full Name", type: "text", required: true },
    { key: "role", label: "Role", type: "text", required: true },
    { key: "email", label: "Email", type: "email", required: true },
    { key: "image", label: "Image path", type: "text", required: true, folder: "people" },
    { key: "ntnuProfile", label: "NTNU Profile URL", type: "text" },
    { key: "publicationsUrl", label: "Publications URL", type: "text" },
    { key: "linkedin", label: "LinkedIn", type: "text" },
    { key: "scholar", label: "Google Scholar", type: "text" },
    { key: "researchgate", label: "ResearchGate", type: "text" },
    { key: "twitter", label: "Twitter / X", type: "text" },
    { key: "researchInterests", label: "Research Interests (comma-separated)", type: "text", isArray: true },
    { key: "shortDescription", label: "Short Description", type: "textarea", required: true },
    { key: "fullBio", label: "Full Bio", type: "textarea" }
];

export default function AdminPeopleTable({ people, setPeople }) {
    const [cristinModal, setCristinModal] = useState(false);
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
        over: (event, i) => { event.preventDefault(); setDragOverIndex(i); },
        drop: (i) => {
            if (dragIndex.current !== null && dragIndex.current !== i) {
                setPeople(reorder(people, dragIndex.current, i));
            }
            dragIndex.current = null;
            setDragOverIndex(null);
        },
        end: () => { dragIndex.current = null; setDragOverIndex(null); },
    };

    async function savePerson(data, index) {
        if (index === null) {
            try {
                const res = await fetch(`${API_URL}/api/people`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                const saved = await res.json();
                setPeople((prev) => [...prev, saved]);
            } catch {
                setPeople((prev) => [...prev, { id: Date.now(), ...data }]);
            }
        } else {
            const person = people[index];
            try {
                const res = await fetch(`${API_URL}/api/people/${person._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                const saved = await res.json();
                setPeople((prev) => prev.map((event, i) => (i === index ? saved : event)));
            } catch {
                setPeople((prev) => prev.map((event, i) => (i === index ? { ...event, ...data } : event)));
            }
        }
        setModal(null);
    }

    async function deletePerson(index) {
        if (!window.confirm("Remove this person?")) return;
        const person = people[index];
        setPeople((prev) => prev.filter((_, i) => i !== index));
        fetch(`${API_URL}/api/people/${person._id}`, { method: "DELETE" }).catch(() => { });
    }

    return (
        <div className="admin-page__table-section">
            <div className="admin-page__section-header">
                <h2 className="admin-page__table-heading">
                    Employees <span className="admin-page__count">({people.length})</span>
                </h2>
                <button
                    className="btn btn--primary"
                    onClick={() => setModal({ item: null, index: null })}
                >
                    Add Employee
                </button>

                <button
                    className="admin-btn admin-btn--primary"
                    onClick={() => setCristinModal(true)}
                >
                    Import Employee
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
                                onDragOver={(event) => drag.over(event, i)}
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
                                        className="btn btn--secondary btn--small"
                                        onClick={() => setModal({ item: person, index: i })}
                                    >Edit</button>
                                    <button
                                        className="btn btn--delete btn--small"
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
                    title={modal.item ? "Edit Employee" : "Add Employee"}
                    fields={PEOPLE_FIELDS}
                    data={modal.item}
                    onSave={(data) => savePerson(data, modal.index)}
                    onClose={() => setModal(null)}
                />
            )}

            {cristinModal && (
                <AdminSearch
                    existingEmails={people.map(p => p.email?.toLowerCase())}

                    onClose={() => setCristinModal(false)}
                    onSelect={(prefilled) => {
                        const exists = people.some(
                            p => p.email?.toLowerCase() === prefilled.email?.toLowerCase() ||
                                p.ntnuProfile === prefilled.ntnuProfile
                        );
                        if (exists) {
                            alert(`${prefilled.name} is already in the employee list.`);
                            return;
                        }
                        setCristinModal(false);
                        setModal({ item: prefilled, index: null });
                    }}
                />
            )}

        </div>
    );
}
