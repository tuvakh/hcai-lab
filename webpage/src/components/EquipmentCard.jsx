function EquipmentCard({ name, category, status, onClick, isSelected }) {
    return (
      <article
        className={`equipment-card ${isSelected ? "equipment-card--selected" : ""}`}
        onClick={onClick}
      >
        <h3>{name}</h3>
        <p>{category}</p>
        <span
          className={`equipment-card__status ${
            status === "Available"
              ? "equipment-card__status--available"
              : "equipment-card__status--booked"
          }`}
        >
          {status}
        </span>
      </article>
    );
  }
  
  export default EquipmentCard;