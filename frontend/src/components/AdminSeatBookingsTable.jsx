import React from 'react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function AdminSeatBookingsTable({ bookings, setBookings, events }) {
  async function deleteBooking(id) {
    if (!window.confirm("Remove this booking?")) return;
    setBookings(prev => prev.filter(b => b.id !== id));
    fetch(`${API_URL}/api/bookings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${sessionStorage.getItem("adminToken")}` },
    }).catch(() => { });
  }

  const grouped = bookings.reduce((acc, booking) => {
    const key = booking.eventId;
    if (!acc[key]) acc[key] = [];
    acc[key].push(booking);
    return acc;
  }, {});

  return (
    <div className="admin-page__table-section">
      <div className="admin-page__section-header">
        <h2 className="admin-page__table-heading">
          Seat Bookings <span className="admin-page__count">({bookings.length})</span>
        </h2>
      </div>
      <div className="admin-page__table-wrap">
        <table className="admin-page__table">
          <thead>
            <tr>
              <th>Booked by</th>
              <th>Email</th>
              <th>Seats</th>
              <th className="admin-page__action-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([eventId, eventBookings]) => {
              const event = events.find(e => e.id === eventId);
              const totalBooked = eventBookings.reduce((sum, b) => sum + (b.seats || 0), 0);
              return (
                <React.Fragment key={`group-${eventId}`}>
                  <tr className="admin-page__group-header">
                    <td colSpan={4}>
                      <strong>{eventBookings[0].eventTitle}</strong>
                      {event && <span className="admin-page__group-seats">— {totalBooked} / {event.maxSeats} seats booked</span>}
                    </td>
                  </tr>
                  {eventBookings.map(booking => (
                    <tr key={booking.id}>
                      <td>{booking.bookedByName}</td>
                      <td>{booking.bookedByEmail}</td>
                      <td>{booking.seats}</td>
                      <td className="admin-page__actions-cell">
                        <button className="btn btn--delete btn--small" onClick={() => deleteBooking(booking.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
