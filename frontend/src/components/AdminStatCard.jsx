export default function AdminStatCard({ label, value, onClick }) {
  return (
    <div
      className={`admin-stat-card${onClick ? " admin-stat-card--clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (event) => event.key === "Enter" && onClick() : undefined}
    >
      <span className="admin-stat-card__value">{value}</span>
      <span className="admin-stat-card__label">{label}</span>
      {onClick && <span className="admin-stat-card__action">Manage &rarr;</span>}
    </div>
  );
}



