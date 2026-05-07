const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function AdminEquipmentBookingsTable({ bookings, setBookings }) {
    async function deleteBooking(id) {
        if (!window.confirm("Remove this booking?")) return;
        setBookings(prev => prev.filter(booking => booking.id !== id));
        fetch(`${API_URL}/api/bookings/${id}`, { method: "DELETE" }).catch(() => {});
    }

    return (
        <div className="admin-page__table-section">
            <div className="admin-page__section-header">
                <h2 className="admin-page__table-heading">
                    Bookings <span className="admin-page__count">({bookings.length})</span>
                </h2>
            </div>
            <div className="admin-page__table-wrap">
                <table className="admin-page__table">
                    <thead>
                        <tr>
                            <th>Equipment</th>
                            <th>Category</th>
                            <th>Booked by</th>
                            <th>Email</th>
                            <th>Start</th>
                            <th>End</th>
                            <th className="admin-page__action-col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.name}</td>
                                <td>{booking.category}</td>
                                <td>{booking.bookedByName}</td>
                                <td>{booking.bookedByEmail}</td>
                                <td>{new Date(booking.startDate).toDateString()}</td>
                                <td>{new Date(booking.endDate).toDateString()}</td>
                                <td className="admin-page__actions-cell">
                                    <button
                                        className="btn btn--delete btn--small"
                                        onClick={() => deleteBooking(booking.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
