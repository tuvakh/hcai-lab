import Button from './Buttons';

function BookingList({ bookings, onUnbook = () => {}, showUnbook = false }) {
  return (
    <div className="booking-list card-grid">
      {bookings.map((booking) => (
        <article className="card" key={booking.id}>
          <div className="card__body">
            {booking.type === "equipment" ? (
              <>
                <h3 className="card__name">{booking.name}</h3>
                <span className="card__role">{booking.category}</span>
                <p className="card__description">
                  <strong>Booked by:</strong> {booking.bookedByName}<br />
                  <strong>Start:</strong> {new Date(booking.startDate).toDateString()}<br />
                  <strong>End:</strong> {new Date(booking.endDate).toDateString()}
                </p>
              </>
            ) : (
              <>
                <h3 className="card__name">{booking.eventTitle}</h3>
                <p className="card__description">{booking.eventDescription}</p>
                <p className="card__description">
                  <strong>Your seats:</strong> {booking.seats}
                </p>
              </>
            )}
            {showUnbook && (
                <Button text="Unbook" variant="white" size="large" action={() => onUnbook(booking.id)} />
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default BookingList;
