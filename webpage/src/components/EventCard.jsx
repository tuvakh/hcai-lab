import { useState } from "react";
import Button from './Buttons';
import Modal from './Modal';

export default function EventCard({title, description, date, place, eventImg, maxSeats, variant}) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [seats, setSeats] = useState(1);

    const dateParts = date.split(" ");
    // "14. Mars kl. 11:00" → ["14.", "Mars", "kl.", "11:00"]
    const day = dateParts[0];    // "14."
    const month = dateParts[1];  // "Mars"
    const time = dateParts[3];   // "11:00"



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ name, email, seats, title, date, place });
    };

    if (variant === "display") {
        return (
            <>
                <div className="eventCardDisplay" >
                    <div className="eventCardDisplay__info img-overlay">
                        <div className='eventCardDisplay__text'>
                            <span className='eventCardDisplay__text--day'>{day}</span>
                            <span className='eventCardDisplay__text--month'>{month}</span>
                        </div>
                        <img className="eventCardDisplay__img" src={eventImg} />
                    </div>
                    <div className='eventCardDisplay__description'>
                        <h3 className='eventCardDisplay__title'>{title}</h3>
                        <p className='eventCardDisplay__time'>{time} {place}</p>
                        <p className='eventCardDisplay__maxSeats'>{maxSeats} seats available – Book on our website!</p>
                    </div>
                </div>
            </>
        );
    }
    return (
      <>
        <div className="eventCard" onClick={() => setIsOpen(true)} style={{cursor: "pointer"}}>
            <div className='eventCard__info img-overlay'>
                <img className="eventCard__img" src={eventImg}/>
                <div className='eventCard__text'>
                    <h3 className='eventCard__text--title'>{title}</h3>
                    <p className='eventCard__text--date'>{date}</p>
                    <p className='eventCard__text--place'>{place}</p>
                </div>
            </div>
            <p className='eventCard__description'>{description}</p>
            <Button className='eventCard__button' text="Book seat" action={() => setIsOpen(true)} variant="blue" />
        </div>       

        {isOpen && (
            <Modal onClose={() => setIsOpen(false)} ariaLabel={title}>
                <div className='img-overlay'>
                    <img src={eventImg} alt={title} className="modal__image modal__image--event img-overlay" />
                    <div className="modal__header modal__header--event">
                        <h2 className="modal__name">{title}</h2>
                        <p className="modal__bio">{description}</p>
                    </div>
                </div>

                <div className="modal__section">
                    <h3 className="modal__section-title">Details</h3>
                    <div className="event-details">
                        <span className="event-details__date">
                            <span className="event-details__icon">📅</span>{date}
                        </span>
                        <span className="event-details__date">
                            <span className="event-details__icon">📍</span>{place}
                        </span>
                    </div>
                </div>

                <div className="modal__section">
                    <h3 className="modal__section-title">Book Seat</h3>
                    <form onSubmit={handleSubmit} className="event-form">
                        <label htmlFor="name">First name:</label>
                        <input id="name" type="text" placeholder="What's your first name" value={name} onChange={(e) => setName(e.target.value)} required />
                        <label htmlFor="email">Email:</label>
                        <input id="email" type="email" placeholder="What's your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <label htmlFor="seats">How many seats do you want?</label>
                        <input id="seats" type="number" min="1" max={maxSeats} value={seats} onChange={(e) => setSeats(e.target.value)} />
                        <button type="submit" className="button button--blue">Book seat</button>
                    </form>
                </div>
            </Modal>
        )}
      </> 
    );
}