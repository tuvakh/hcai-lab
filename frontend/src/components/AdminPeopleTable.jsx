// src/components/AdminPeopleTable.jsx
import { useState } from "react";
import AdminEditModal from "./AdminEditModal";
import AdminSearch from "./AdminSearch";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const PEOPLE_FIELDS = [
    { key: "name", label: "Full Name", type: "text", required: true, placeholder: "e.g. Ola Nordmann" },
    { key: "role", label: "Role", type: "text", required: true, placeholder: "e.g. Associate Professor" },
    { key: "email", label: "Email", type: "email", required: true, placeholder: "e.g. ola@ntnu.no" },
    { key: "image", label: "Image path", type: "text", required: true, folder: "people" },
    { key: "ntnuProfile", label: "NTNU Profile URL", type: "text", placeholder: "https://www.ntnu.edu/employees/username" },
    { key: "publicationsUrl", label: "Publications URL", type: "text", placeholder: "https://..." },
    { key: "linkedin", label: "LinkedIn", type: "text", placeholder: "https://linkedin.com/in/username" },
    { key: "scholar", label: "Google Scholar", type: "text", placeholder: "https://scholar.google.com/citations?user=..." },
    { key: "researchgate", label: "ResearchGate", type: "text", placeholder: "https://researchgate.net/profile/..." },
    { key: "twitter", label: "Twitter / X", type: "text", placeholder: "@username" },
    { key: "researchInterests", label: "Research Interests (comma-separated)", type: "text", isArray: true, placeholder: "e.g. AI, HCI, Ethics" },
    { key: "shortDescription", label: "Short Description", type: "textarea", placeholder: "Brief intro visible on the people page" },
    { key: "fullBio", label: "Full Bio", type: "textarea", placeholder: "Extended biography shown in the profile modal" }
];

export default function AdminPeopleTable({ people, setPeople }) {
    const [cristinModal, setCristinModal] = useState(false);
    const [modal, setModal] = useState(null);
    const { drag, dragOverIndex } = useDragAndDrop(people, setPeople);

    async function savePerson(data, index) {
        if (index === null) {
            try {
                const response = await fetch(`${API_URL}/api/people`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                const saved = await response.json();
                setPeople((prev) => [...prev, saved]);
            } catch {
                setPeople((prev) => [...prev, { id: Date.now(), ...data }]);
            }
        } else {
            const person = people[index];
            try {
                const response = await fetch(`${API_URL}/api/people/${person._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                const saved = await response.json();
                setPeople((prev) => prev.map((person, itemIndex) => (itemIndex === index ? saved : person)));
            } catch {
                setPeople((prev) => prev.map((person, itemIndex) => (itemIndex === index ? { ...person, ...data } : person)));
            }
        }
        setModal(null);
    }

    async function deletePerson(index) {
        if (!window.confirm("Remove this person?")) return;
        const person = people[index];
        setPeople((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
        fetch(`${API_URL}/api/people/${person._id}`, { method: "DELETE" }).catch(() => { });
    }

    return (
        <div className="admin-page__table-section">
            <div className="admin-page__section-header">
                <h2 className="admin-page__table-heading">
                    Employees <span className="admin-page__count">({people.length})</span>
                </h2>
                <div className="admin-page__btn-group">
                    <button
                        className="btn btn--primary"
                        onClick={() => setModal({ item: null, index: null })}
                    >
                        Add Employee
                    </button>
                    <button
                        className="btn btn--primary"
                        onClick={() => setCristinModal(true)}
                    >
                        Import Employee
                    </button>
                </div>
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
                        {people.map((person, index) => (
                            <tr
                                key={person.id}
                                draggable
                                onDragStart={() => drag.start(index)}
                                onDragOver={(event) => drag.over(event, index)}
                                onDrop={() => drag.drop(index)}
                                onDragEnd={drag.end}
                                className={dragOverIndex === index ? "admin-page__row--drag-over" : ""}
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
                                        onClick={() => setModal({ item: person, index: index })}
                                    >Edit</button>
                                    <button
                                        className="btn btn--delete btn--small"
                                        onClick={() => deletePerson(index)}
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
                    type="employee"
                    existingEmails={people.map(person => person.email?.toLowerCase())}

                    onClose={() => setCristinModal(false)}
                    onSelect={(prefilled) => {
                        const exists = people.some(
                            person => person.email?.toLowerCase() === prefilled.email?.toLowerCase() ||
                                person.ntnuProfile === prefilled.ntnuProfile
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
