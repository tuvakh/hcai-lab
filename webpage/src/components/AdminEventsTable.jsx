// src/components/AdminEventsTable.jsx
import { useRef, useState } from "react";
import AdminEditModal from "./AdminEditModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const EVENT_FIELDS = [
    { key: "title", label: "Title", type: "text", maxLength: 40, required: true },
    { key: "date", label: "Date", type: "datetime-local", required: true },
    { key: "place", label: "Location", type: "text", required: true },
    { key: "maxSeats", label: "Max Seats", type: "number", required: true },
    { key: "description", label: "Description", type: "textarea", maxLength: 160, required: true},
    { key: "eventImg", label: "Image path", type: "text", required: true },

];

export default function AdminEventsTable({ events, setEvents }) {
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
        over: (e, i) => { e.preventDefault(); setDragOverIndex(i); },
        drop: (i) => {
            if (dragIndex.current !== null && dragIndex.current !== i) {
                setEvents(reorder(events, dragIndex.current, i));
            }
            dragIndex.current = null;
            setDragOverIndex(null);
        },
        end: () => { dragIndex.current = null; setDragOverIndex(null); },
    };

    async function saveEvent(data, index) {
        if (index === null) {
            try {
                const res = await fetch(`${API_URL}/api/events`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                const saved = await res.json();
                setEvents((prev) => [...prev, saved]);
            } catch {
                setEvents((prev) => [...prev, { id: Date.now(), ...data }]);
            }
        } else {
            const event = events[index];
            try {
                const res = await fetch(`${API_URL}/api/events/${event._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                const saved = await res.json();
                setEvents((prev) => prev.map((e, i) => (i === index ? saved : e)));
            } catch {
                setEvents((prev) => prev.map((e, i) => (i === index ? { ...e, ...data } : e)));
            }
        }
        setModal(null);
    }


    async function deleteEvent(index) {
        if (!window.confirm("Remove this event?")) return;
        const event = events[index];
        setEvents((prev) => prev.filter((_, i) => i !== index));
        fetch(`${API_URL}/api/events/${event._id}`, { method: "DELETE" }).catch(() => { });
    }


    return (
        <div className="admin-page__table-section">
            <div className="admin-page__section-header">
                <h2 className="admin-page__table-heading">
                    Events <span className="admin-page__count">({events.length})</span>
                </h2>
                <button
                    className="admin-btn admin-btn--primary"
                    onClick={() => setModal({ item: null, index: null })}
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
                                onDragStart={() => drag.start(i)}
                                onDragOver={(e) => drag.over(e, i)}
                                onDrop={() => drag.drop(i)}
                                onDragEnd={drag.end}
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
                                        onClick={() => setModal({ item: event, index: i })}
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

            {modal && (
                <AdminEditModal
                    title={modal.item ? "Edit Event" : "Add Event"}
                    fields={EVENT_FIELDS}
                    data={modal.item}
                    onSave={(data) => saveEvent(data, modal.index)}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
}
