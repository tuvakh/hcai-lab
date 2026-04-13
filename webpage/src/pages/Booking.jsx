import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import HeroSection from "../components/HeroSection";
import BookingList from "../components/BookingList";
import { equipments } from "../data/equipmentData";
import Modal from "../components/Modal";

function toKey(date) {
  return date.toISOString().split("T")[0]; 
}

function getCurrentWeekDays() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

export default function Booking() {
  const [equipment] = useState(equipments);
  const [myBookings, setMyBookings] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [selectedRange, setSelectedRange] = useState(null); 

  function isDateBooked(equipmentId, date) {
    const key = toKey(date);
    return myBookings.some((booking) => {
      if (booking.equipmentId !== equipmentId) return false;
      return key >= toKey(booking.startDate) && key <= toKey(booking.endDate);
    });
  }

  function getOverallStatus(item) {
    const allBooked = getCurrentWeekDays().every((date) =>
      isDateBooked(item.id, date)
    );
    return allBooked ? "Booked" : "Available";
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
      equipmentId: selectedEquipment.id,
      name: selectedEquipment.name,
      category: selectedEquipment.category,
      startDate,
      endDate,
    };

    setMyBookings((prev) => [...prev, newBooking]);
    setSelectedEquipment(null);
    setSelectedRange(null);
  }

  function handleUnbook(id) {
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

                <Calendar
                    selectRange={true}
                    onChange={setSelectedRange}
                    value={selectedRange}
                    tileClassName={({ date }) =>
                        isDateBooked(selectedEquipment.id, date) ? "tile--booked" : null
                    }
                    tileDisabled={({ date }) =>
                        isDateBooked(selectedEquipment.id, date)
                    }
                />

                {selectedRange && (
              <p className="booking-duration__summary">
                {selectedRange[0].toDateString()} → {selectedRange[1].toDateString()}
              </p>
            )}
          </div>
            

            <div className="modal__contact">
              <button
                type="button"
                className="button button--blue"
                onClick={handleBook}
                disabled={!selectedRange}
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
