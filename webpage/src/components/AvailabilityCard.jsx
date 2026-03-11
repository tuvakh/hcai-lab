function AvailabilityCard({ availability }) {
    return (
      <div className="availability-card">
        <h2>Availability</h2>
  
        <ul>
          {availability.map((slot) => (
            <li key={slot.day}>
              <span>{slot.day}</span>
              <span
                className={
                  slot.status === "Available"
                    ? "status status--available"
                    : "status status--booked"
                }
              >
                {slot.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default AvailabilityCard;