// src/components/AdminStatCard.jsx
export default function AdminStatCard({ label, value, icon }) {
  return (
    <div className="admin-stat-card">
      {icon && <span className="admin-stat-card__icon" aria-hidden="true">{icon}</span>}
      <span className="admin-stat-card__value">{value}</span>
      <span className="admin-stat-card__label">{label}</span>
    </div>
  );
}
