import Tag from './Tags';

function BookingList({ bookings, onUnbook }) {
  return (
    <div className="booking-list card-grid">
      {bookings.map((booking) => (
        <article className="card" key={booking.id}>
          <div className="card__body">
            <h3 className="card__name">{booking.name}</h3>
            <span className="card__role">{booking.category}</span>

            <p className="card__desc">
              <strong>Booked by:</strong> {booking.bookedByName}<br />
              <strong>Start:</strong> {new Date(booking.startDate).toDateString()}<br />
              <strong>End:</strong> {new Date(booking.endDate).toDateString()}
            </p>

            <button
              type="button"
              className="btn btn--white btn--large"
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
