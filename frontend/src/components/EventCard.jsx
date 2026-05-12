import { useState, useEffect } from "react";
import Button from './Buttons';
import Modal from './Modal';
import { useNavigate, Link } from "react-router";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function EventCard({ title, description, date, place, eventImg, eventId, bookSeat, maxSeats, seatsLeft, variant, onBooked }) {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState(user?.email || "");
    const [seats, setSeats] = useState(1);
    const [booked, setBooked] = useState(false);

    const eventDate = new Date(date);
    const isValidDate = !isNaN(eventDate);
    const day = isValidDate ? eventDate.getDate() + "." : date.split(" ")[0];
    const month = isValidDate ? eventDate.toLocaleString("en-US", { month: "long" }) : date.split(" ")[1];
    const time = isValidDate ? eventDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : date.split(" ")[3];

    const handleSubmit = async (formEvent) => {
        formEvent.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    type: "seat",
                    eventId,
                    eventTitle: title,
                    eventDescription: description,
                    bookedByName: name,
                    bookedByEmail: email,
                    seats,
                }),
            });
            if (!response.ok) {
                const err = await response.json();
                alert(err.error || "Booking failed");
                return;
            }
            onBooked(eventId, seats);
            setBooked(true);
            setIsOpen(false);
            setName('');
            setEmail('');
            setSeats(1);
        } catch (error) {
            console.error("Booking failed:", error);
        }
    };

    function formatDate(dateStr) {
        const eventDate = new Date(dateStr);
        if (isNaN(eventDate)) return dateStr;
        return eventDate.toLocaleString("en-US", {
            day: "numeric", month: "long", hour: "2-digit", minute: "2-digit"
        });
    }

    if (variant === "display") {
        return (
            <div className="eventCardDisplay">
                <div className="eventCardDisplay__info img-overlay">
                    <div className="eventCardDisplay__text">
                        <span className="eventCardDisplay__text--day">{day}</span>
                        <span className="eventCardDisplay__text--month">{month}</span>
                    </div>
                    <img className="eventCardDisplay__img" src={eventImg} />
                </div>
                <div className="eventCardDisplay__description">
                    <h3 className="eventCardDisplay__title">{title}</h3>
                    <p>{time} {place}</p>
                    <p>{maxSeats} seats available – Book on our website!</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="eventCard" onClick={() => setIsOpen(true)}>
                <div className='eventCard__info img-overlay'>
                    <img className="eventCard__img" src={eventImg} />
                    <div className='eventCard__text'>
                        <h3 className='eventCard__text--title'>{title}</h3>
                        <p>{formatDate(date)}</p>
                        <p>{place}</p>
                    </div>
                </div>
                <p className='eventCard__description'>{description}</p>
                <Button className='eventCard__button' text="Book seat" action={() => setIsOpen(true)} variant="primary" />
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
                                <span className="event-details__icon">📅</span>{formatDate(date)}
                            </span>
                            <span className="event-details__date">
                                <span className="event-details__icon">📍</span>{place}
                            </span>
                            <span className="event-details__date">
                                <span className="event-details__icon">🪑</span>{seatsLeft} / {maxSeats} seats available
                            </span>
                        </div>
                    </div>

                    <div className="modal__section">
                        <h3 className="modal__section-title">Book Seat</h3>
                        {!token ? (
                            <p>You need to <Link to="/login">log in</Link> to book a seat.</p>
                        ) : booked ? (
                            <p>Your seat has been booked!</p>
                        ) : seatsLeft <= 0 ? (
                            <p>This event is fully booked.</p>
                        ) : (
                            <form onSubmit={handleSubmit} className="event-form">
                                <label htmlFor="name">First name:</label>
                                <input id="name" type="text" placeholder="What's your first name" value={name} onChange={(event) => setName(event.target.value)} required />
                                <label htmlFor="email">Email:</label>
                                <input id="email" type="email" placeholder="What's your email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                                <label htmlFor="seats">How many seats do you want?</label>
                                <input id="seats" type="number" min="1" max={seatsLeft} placeholder="Number of seats" value={seats} onChange={(event) => setSeats(Number(event.target.value))} />
                                <Button text="Book seat" type="submit" variant="primary" size="large" disabled={seatsLeft <= 0} />
                            </form>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
}
