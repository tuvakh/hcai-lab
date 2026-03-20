function AvailabilityCard({ availability }) {
  return (
    <aside className="availability-card" aria-labelledby="availability-title">
      <h2 id="availability-title">Availability</h2>

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
    </aside>
  );
}

export default AvailabilityCard;