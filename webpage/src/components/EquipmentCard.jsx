function EquipmentCard({ name, category, description, image, status, onClick, isSelected }) {   return (
      <article
        className={`equipment-card ${isSelected ? "equipment-card--selected" : ""}`}
        onClick={onClick}
      >
        <div className="equipment-card__image">
         <img src={image} alt={name} />
        </div>
        
        <h3>{name}</h3>
        <p>{category}</p>
        <p className="equipment-card__description">{description}</p>
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