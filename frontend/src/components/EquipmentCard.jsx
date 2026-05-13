import Tag from './Tags';
import { cloudinaryUrl } from "../utils/cloudinaryUrl";

function EquipmentCard({ name, category, description, image, status, onClick, isSelected }) {   return (
      <article
        className={`equipment-card ${isSelected ? "equipment-card--selected" : ""}`}
        onClick={onClick}
      >
        <div className="equipment-card__image">
         <img src={cloudinaryUrl(image, 400)} alt={name} loading="lazy" />
        </div>
        
        <h3>{name}</h3>
        <p>{category}</p>
        <p className="equipment-card__description">{description}</p>
        <Tag status={status === "Available" ? "available" : "booked"}>{status}</Tag>
      </article>
    );
  }
  
  export default EquipmentCard;