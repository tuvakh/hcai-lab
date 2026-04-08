import { useState } from "react";
import HeroSection from "../components/HeroSection";
import AvailabilityCard from "../components/AvailabilityCard";
import BookingList from "../components/BookingList";
import { equipments } from "../data/equipmentData";
import Modal from '../components/Modal';

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function Booking() {
  const [equipment] = useState(equipments);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedStartDay, setSelectedStartDay] = useState("Monday");
  const [selectedEndDay, setSelectedEndDay] = useState("Monday");

  function getDayIndex(day) {
    return days.indexOf(day);
  }

  function getAvailabilityForEquipment(equipmentId) {
    return days.map((day, index) => {
      const isBooked = myBookings.some((booking) => {
        if (booking.equipmentId !== equipmentId) return false;

        const startIndex = getDayIndex(booking.startDay);
        const endIndex = getDayIndex(booking.endDay);

        return index >= startIndex && index <= endIndex;
      });

      return {
        day,
        status: isBooked ? "Booked" : "Available",
      };
    });
  }

  function getOverallStatus(item) {
    const availability = getAvailabilityForEquipment(item.id);
    const allBooked = availability.every((slot) => slot.status === "Booked");
    return allBooked ? "Booked" : "Available";
  }

  function openEquipment(item) {
    setSelectedEquipment(item);

    const availability = getAvailabilityForEquipment(item.id);
    const firstAvailable = availability.find((slot) => slot.status === "Available");

    if (firstAvailable) {
      setSelectedStartDay(firstAvailable.day);
      setSelectedEndDay(firstAvailable.day);
    } else {
      setSelectedStartDay("Monday");
      setSelectedEndDay("Monday");
    }
  }

  function handleBook() {
    if (!selectedEquipment) return;

    const startIndex = getDayIndex(selectedStartDay);
    const endIndex = getDayIndex(selectedEndDay);

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      alert("End day must be the same day or after start day.");
      return;
    }

    const conflict = myBookings.some((booking) => {
      if (booking.equipmentId !== selectedEquipment.id) return false;

      const bookingStart = getDayIndex(booking.startDay);
      const bookingEnd = getDayIndex(booking.endDay);

      return !(endIndex < bookingStart || startIndex > bookingEnd);
    });

    if (conflict) {
      alert("This equipment is already booked in that time period.");
      return;
    }

    const newBooking = {
      id: crypto.randomUUID(),
      equipmentId: selectedEquipment.id,
      name: selectedEquipment.name,
      category: selectedEquipment.category,
      startDay: selectedStartDay,
      endDay: selectedEndDay,
    };

    setMyBookings((prev) => [...prev, newBooking]);
    setSelectedEquipment(null);
  }

  function handleUnbook(id) {
    setMyBookings((prev) => prev.filter((booking) => booking.id !== id));
  }

  const selectedAvailability = selectedEquipment
    ? getAvailabilityForEquipment(selectedEquipment.id)
    : [];

  const availableEndDays = selectedAvailability.filter(
    (slot) => getDayIndex(slot.day) >= getDayIndex(selectedStartDay)
  );

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
        <h2 className="booking-page__section-title">Browse Equipment</h2>

        <div className="card-grid">
          {equipment.map((item, i) => {
            const status = getOverallStatus(item);

            return (
              <button
                key={item.id}
                type="button"
                className="card"
                onClick={() => openEquipment(item)}
                style={{ animationDelay: `${i * 0.07}s` }}
                aria-label={`Open ${item.name}`}
              >
                <div className="card__image-wrap">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="card__image" />
                  ) : (
                    <div className="card__image card__image--placeholder" />
                  )}
                </div>

                <div className="card__body">
                  <h3 className="card__name">{item.name}</h3>
                  <span className="card__role">{item.category}</span>

                  <div className="card__tags">
                    <span
                      className={`card__tag ${
                        status === "Available"
                          ? "card__tag--ongoing"
                          : "card__tag--completed"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="card__desc">{item.description}</p>
                  <span className="card__cta">View booking details →</span>
                </div>
              </button>
            );
          })}
        </div>
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
                  <span
                    className={`modal__tag ${
                      getOverallStatus(selectedEquipment) === "Available"
                        ? "modal__tag--ongoing"
                        : "modal__tag--completed"
                    }`}
                  >
                    {getOverallStatus(selectedEquipment)}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal__body">
              <p className="modal__bio">{selectedEquipment.description}</p>
            </div>

            <div className="modal__section">
              <h3 className="modal__section-title">Booking Period</h3>

              <div className="booking-duration">
                <label htmlFor="start-day">
                  <strong>Start day:</strong>
                </label>
                <select
                  id="start-day"
                  value={selectedStartDay}
                  onChange={(e) => {
                    setSelectedStartDay(e.target.value);
                    setSelectedEndDay(e.target.value);
                  }}
                >
                  {selectedAvailability.map((slot) => (
                    <option
                      key={slot.day}
                      value={slot.day}
                      disabled={slot.status === "Booked"}
                    >
                      {slot.day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="booking-duration">
                <label htmlFor="end-day">
                  <strong>End day:</strong>
                </label>
                <select
                  id="end-day"
                  value={selectedEndDay}
                  onChange={(e) => setSelectedEndDay(e.target.value)}
                >
                  {availableEndDays.map((slot) => (
                    <option
                      key={slot.day}
                      value={slot.day}
                      disabled={slot.status === "Booked"}
                    >
                      {slot.day}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal__section">
              <AvailabilityCard availability={selectedAvailability} />
            </div>

            <div className="modal__contact">
              <button
                type="button"
                className="button button--blue"
                onClick={handleBook}
              >
                Book equipment
              </button>
            </div>
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
