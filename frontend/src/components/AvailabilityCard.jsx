import Tag from './Tags';

function AvailabilityCard({ availability }) {
  return (
    <aside className="availability-card" aria-labelledby="availability-title">
      <h2 id="availability-title">Availability</h2>

      <ul>
        {availability.map((slot) => (
          <li key={slot.day}>
            <span>{slot.day}</span>
            <Tag status={slot.status === "Available" ? "available" : "booked"}>{slot.status}</Tag>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default AvailabilityCard;