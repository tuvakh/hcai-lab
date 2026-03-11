function BookingList({ bookings, onUnbook }) {
  return (
    <div className="my-bookings">
      {bookings.map((booking) => (
        <div className="my-bookings__item" key={booking.id}>
          <div className="my-bookings__info">
            <h3>{booking.name}</h3>
            <p>{booking.category}</p>
            <p><strong>Start day:</strong> {booking.startDay}</p>
            <p><strong>End day:</strong> {booking.endDay}</p>
          </div>

          <button
            className="unbook-button"
            onClick={() => onUnbook(booking.id)}
          >
            Unbook
          </button>
        </div>
      ))}
    </div>
  );
}

export default BookingList;