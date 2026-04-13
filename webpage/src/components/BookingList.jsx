function BookingList({ bookings, onUnbook }) {
  return (
    <div className="booking-list card-grid">
      {bookings.map((booking) => (
        <article className="card" key={booking.id}>
          <div className="card__body">
            <h3 className="card__name">{booking.name}</h3>
            <span className="card__role">{booking.category}</span>

            <div className="card__tags">
              <span className="card__tag card__tag--student">Booked</span>
            </div>

            <p className="card__desc">
              <strong>Start day:</strong> {booking.startDay}
              <br />
              <strong>End day:</strong> {booking.endDay}
            </p>

            <button
              type="button"
              className="button button--white"
              onClick={() => onUnbook(booking.id)}
            >
              Unbook
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default BookingList;