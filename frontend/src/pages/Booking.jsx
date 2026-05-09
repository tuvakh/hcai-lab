import { useState, useEffect } from "react";
import { Link } from "react-router";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import HeroSection from "../components/HeroSection";
import BookingList from "../components/BookingList";
import Modal from "../components/Modal";
import CardGrid from "../components/CardGrid";
import Tag from '../components/Tags';
import Button from "../components/Buttons";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function toKey(date) {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

export default function Booking() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState([]);
    const [myBookings, setMyBookings] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [selectedRange, setSelectedRange] = useState(null);
    const [bookedByName, setBookedByName] = useState("");
    const [bookedByEmail, setBookedByEmail] = useState(user?.email || "");


    useEffect(() => {
        fetch(`${API_URL}/api/equipment`)
            .then(response => response.json())
            .then(setEquipment)
            .catch(() => { });
    }, []);

    useEffect(() => {
        fetch(`${API_URL}/api/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => response.json())
            .then(data => setMyBookings(
                data
                    .filter(b => b.type === "equipment")
                    .map(booking => ({
                        ...booking,
                        startDate: new Date(booking.startDate),
                        endDate: new Date(booking.endDate)
                    }))
            ))
            .catch(() => { });
    }, []);

    function isDateBooked(equipmentId, date) {
        const key = toKey(date);
        return myBookings.some((booking) => {
            if (booking.equipmentId !== equipmentId) return false;
            return key >= toKey(booking.startDate) && key <= toKey(booking.endDate);
        });
    }

    function getOverallStatus(item) {
        return isDateBooked(item.id, new Date()) ? "Booked" : "Available";
    }

    function openEquipment(item) {
        setSelectedEquipment(item);
        setSelectedRange(null);
    }

    function handleBook() {
        if (!selectedEquipment || !selectedRange) return;
        const [startDate, endDate] = selectedRange;

        const conflict = myBookings.some((booking) => {
            if (booking.equipmentId !== selectedEquipment.id) return false;
            return !(
                toKey(endDate) < toKey(booking.startDate) ||
                toKey(startDate) > toKey(booking.endDate)
            );
        });

        if (conflict) {
            alert("This equipment is already booked in that time period.");
            return;
        }

        const newBooking = {
            id: crypto.randomUUID(),
            type: "equipment",
            equipmentId: selectedEquipment.id,
            name: selectedEquipment.name,
            category: selectedEquipment.category,
            startDate,
            endDate,
            bookedByName,
            bookedByEmail,
        };

        fetch(`${API_URL}/api/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newBooking),
        })
            .then(response => response.json())
            .then(saved => setMyBookings(prev => [...prev, {
                ...saved,
                startDate: new Date(saved.startDate),
                endDate: new Date(saved.endDate),
            }]))
            .catch(() => setMyBookings(prev => [...prev, newBooking]));

        setSelectedEquipment(null);
        setSelectedRange(null);
    }

    function handleUnbook(id) {
        fetch(`${API_URL}/api/bookings/${id}`, { method: "DELETE" }).catch(() => { });
        setMyBookings((prev) => prev.filter((booking) => booking.id !== id));
    }

    return (
        <main className="booking-page">
            <HeroSection heroImg="/assets/hero/equipment.png">
                <p className="heroSection__intro--label">Equipment</p>
                <h1 className="heroSection__intro--title">Book Equipment</h1>
                <p className="heroSection__intro--text">
                    Reserve available equipment from the HCAI lab and manage your bookings.
                </p>
            </HeroSection>

            <section className="booking-page__grid-section">
                <CardGrid
                    variant="equipment"
                    items={equipment.map(item => ({ ...item, status: getOverallStatus(item) }))}
                    onSelect={openEquipment}
                />
            </section>

            {selectedEquipment && (
                <Modal onClose={() => setSelectedEquipment(null)} ariaLabel={selectedEquipment.name}>
                    <div className="modal__header">
                        <div className="modal__image-wrap">
                            {selectedEquipment.image ? (
                                <img
                                    src={selectedEquipment.image}
                                    alt={selectedEquipment.name}
                                    className="modal__image"
                                />
                            ) : (
                                <div className="modal__image modal__image--placeholder" />
                            )}
                        </div>

                        <div className="modal__header-text">
                            <h2 className="modal__name">{selectedEquipment.name}</h2>
                            <span className="modal__role">{selectedEquipment.category}</span>

                            <div className="modal__tags">
                                <Tag status={selectedEquipment.status === "Available" ? "available" : "booked"}>
                                    {selectedEquipment.status}
                                </Tag>
                            </div>
                        </div>
                    </div>

                    <div className="modal__body">
                        <p className="modal__bio">{selectedEquipment.description}</p>
                    </div>

                    {!token ? (
                    <div className="modal__section">
                        <p>You need to <Link to="/login">log in</Link> to book equipment.</p>
                    </div>
                    ) : (
                    <form className="modal__section" onSubmit={event => { event.preventDefault(); handleBook(); }}>
                        <h3 className="modal__section-title">Book Equipment</h3>
                        <div className="event-form">
                            <label htmlFor="bookedByName">Name:</label>
                            <input
                                id="bookedByName"
                                type="text"
                                placeholder="Your name"
                                value={bookedByName}
                                onChange={event => setBookedByName(event.target.value)}
                                required
                            />
                            <p className="form-hint">Your name may be visible to others. Avoid using your full name unless intended.</p>
                            <label htmlFor="bookedByEmail">Email:</label>
                            <input
                                id="bookedByEmail"
                                type="email"
                                placeholder="Your email"
                                value={bookedByEmail}
                                onChange={event => setBookedByEmail(event.target.value)}
                                required
                            />
                            <p className="form-hint">Your email is only visible to admins.</p>
                            <label>Select booking period:</label>
                            <Calendar
                                selectRange={true}
                                onChange={setSelectedRange}
                                value={selectedRange}
                                tileClassName={({ date }) =>
                                    isDateBooked(selectedEquipment.id, date) ? "tile--booked" : null
                                }
                                tileDisabled={({ date, view }) => {
                                    if (view !== "month") return false;
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    return date < today || isDateBooked(selectedEquipment.id, date);
                                }}
                            />
                            <p className="form-hint form-hint--calendar">Greyed out dates are already booked or in the past.</p>
                            {selectedRange && (
                                <p className="booking-duration__summary">
                                    {selectedRange[0].toDateString()} → {selectedRange[1].toDateString()}
                                </p>
                            )}
                            <button
                                type="submit"
                                className="btn btn--primary btn--large"
                                disabled={!selectedRange}
                            >
                                Book equipment
                            </button>
                        </div>
                    </form>
                    )}
                </Modal>
            )}

            {myBookings.length > 0 && (
                <section className="booking-page__contact">
                    <h2 className="booking-page__contact-title">My Bookings</h2>
                    <p className="booking-page__contact-text">
                        Here you can review and manage your current equipment bookings.
                    </p>
                    <BookingList bookings={myBookings} onUnbook={handleUnbook} />
                </section>
            )}
        </main>
    );
}
