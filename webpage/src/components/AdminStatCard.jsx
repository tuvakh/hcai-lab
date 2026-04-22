// src/components/AdminStatCard.jsx
export default function AdminStatCard({ label, value, description, onClick }) {
  return (
    <div
      className={`admin-stat-card${onClick ? " admin-stat-card--clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      <span className="admin-stat-card__value">{value}</span>
      <span className="admin-stat-card__label">{label}</span>
      {description && <p className="admin-stat-card__description">{description}</p>}
      {onClick && <span className="admin-stat-card__action">Manage &rarr;</span>}
    </div>
  );
}



