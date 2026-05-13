// src/components/AdminEventsTable.jsx
import { useState } from "react";
import AdminEditModal from "./AdminEditModal";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const EVENT_FIELDS = [
    { key: "title", label: "Title", type: "text", maxLength: 40, required: true, placeholder: "e.g. AI Workshop" },
    { key: "date", label: "Date", type: "datetime-local", required: true },
    { key: "place", label: "Location", type: "text", required: true, placeholder: "e.g. Statsbygg, Trondheim" },
    { key: "maxSeats", label: "Max Seats", type: "number", required: true, placeholder: "e.g. 30" },
    { key: "description", label: "Description", type: "textarea", maxLength: 160, required: true, placeholder: "Brief event description" },
    { key: "eventImg", label: "Image path", type: "text", required: true, folder: "events" },
];

export default function AdminEventsTable({ events, setEvents, seatBookings = [] }) {
    const [modal, setModal] = useState(null);
    const { drag, dragOverIndex } = useDragAndDrop(events, setEvents);

    async function saveEvent(data, index) {
        if (index === null) {
            try {
                const response = await fetch(`${API_URL}/api/events`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                const saved = await response.json();
                setEvents((prev) => [...prev, saved]);
            } catch {
                setEvents((prev) => [...prev, { id: Date.now(), ...data }]);
            }
        } else {
            const existingEvent = events[index];
            try {
                const response = await fetch(`${API_URL}/api/events/${existingEvent._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                const saved = await response.json();
                setEvents((prev) => prev.map((eventItem, itemIndex) => (itemIndex === index ? saved : eventItem)));
            } catch {
                setEvents((prev) => prev.map((eventItem, itemIndex) => (itemIndex === index ? { ...eventItem, ...data } : eventItem)));
            }
        }
        setModal(null);
    }


    async function deleteEvent(index) {
        if (!window.confirm("Remove this event?")) return;
        const existingEvent = events[index];
        setEvents((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
        fetch(`${API_URL}/api/events/${existingEvent._id}`, { method: "DELETE" }).catch(() => { });
    }


    return (
        <div className="admin-page__table-section">
            <div className="admin-page__section-header">
                <h2 className="admin-page__table-heading">
                    Events <span className="admin-page__count">({events.length})</span>
                </h2>
                <button
                    className="btn btn--primary"
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
                            <th>Seats (left/max)</th>
                            <th>Description</th>
                            <th className="admin-page__action-col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((eventItem, index) => {
                            const isPast = new Date(eventItem.date) < new Date();
                            return(
                            <tr
                                key={eventItem.id}
                                draggable
                                onDragStart={() => drag.start(index)}
                                onDragOver={(event) => drag.over(event, index)}
                                onDrop={() => drag.drop(index)}
                                onDragEnd={drag.end}
                                className={`${dragOverIndex === index ? "admin-page__row--drag-over" : ""} ${isPast ? "admin-page__row--past" : ""}`}
                            >
                                <td className="admin-page__drag-handle" title="Drag to reorder">&#8942;</td>
                                <td>{eventItem.title}</td>
                                <td>{eventItem.date}</td>
                                <td>{eventItem.place}</td>
                                <td>{eventItem.maxSeats - seatBookings.filter(booking => booking.eventId === eventItem._id).reduce((sum, booking) => sum + (booking.seats || 1), 0)}/{eventItem.maxSeats}</td>
                                <td className="admin-page__desc-cell">{eventItem.description}</td>
                                <td className="admin-page__actions-cell">
                                    <button
                                        className="btn btn--secondary btn--small"
                                        onClick={() => setModal({ item: eventItem, index: index })}
                                    >Edit</button>
                                    <button
                                        className="btn btn--delete btn--small"
                                        onClick={() => deleteEvent(index)}
                                    >Delete</button>
                                </td>
                            </tr>
                            )
                        })}
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
