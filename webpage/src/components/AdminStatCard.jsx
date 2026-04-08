// src/components/AdminStatCard.jsx
export default function AdminStatCard({ label, value }) {
  return (
    <div className="admin-stat-card">
      <span className="admin-stat-card__value">{value}</span>
      <span className="admin-stat-card__label">{label}</span>
    </div>
  );
}
