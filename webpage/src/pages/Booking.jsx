import React, { useState } from "react";
import EquipmentCard from "../components/EquipmentCard";
import AvailabilityCard from "../components/AvailabilityCard";
import BookingList from "../components/BookingList";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function Booking() {
  const [equipment] = useState([
    { id: 1, name: "Projector A", category: "Presentation" },
    { id: 2, name: "Laptop Pro 15", category: "Computing" },
    { id: 3, name: "Camera Kit", category: "Photography" },
  ]);

  const [myBookings, setMyBookings] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(equipment[0]);
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

  function handleSelect(item) {
    setSelectedEquipment(item);

    const availability = getAvailabilityForEquipment(item.id);
    const firstAvailable = availability.find((slot) => slot.status === "Available");

    if (firstAvailable) {
      setSelectedStartDay(firstAvailable.day);
      setSelectedEndDay(firstAvailable.day);
    }
  }

  function handleBook() {
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

    const updatedAvailability = getAvailabilityForEquipment(selectedEquipment.id);
    const nextAvailable = updatedAvailability.find((slot) => slot.status === "Available");

    if (nextAvailable) {
      setSelectedStartDay(nextAvailable.day);
      setSelectedEndDay(nextAvailable.day);
    }
  }

  function handleUnbook(id) {
    setMyBookings((prev) => prev.filter((booking) => booking.id !== id));
  }

  const selectedAvailability = getAvailabilityForEquipment(selectedEquipment.id);

  return (
    <main className="booking-page">
      <section className="booking-hero">
        <div className="booking-hero__content">
          <h1>Book equipment</h1>
          <p>
            Reserve available equipment from the HCAI lab and manage your bookings.
          </p>
        </div>
      </section>

      <section className="booking-section">
        <h2>Browse Equipment</h2>

        <div className="booking-cards">
          {equipment.map((item) => (
            <EquipmentCard
              key={item.id}
              name={item.name}
              category={item.category}
              status={getOverallStatus(item)}
              isSelected={selectedEquipment.id === item.id}
              onClick={() => handleSelect(item)}
            />
          ))}
        </div>
      </section>

      <section className="booking-section booking-section--middle">
        <div className="details-card">
          <h2>Selected Equipment Details</h2>
          <p><strong>Name:</strong> {selectedEquipment.name}</p>
          <p><strong>Category:</strong> {selectedEquipment.category}</p>
          <p><strong>Status:</strong> {getOverallStatus(selectedEquipment)}</p>

          <div className="booking-duration">
            <label htmlFor="start-day"><strong>Start day:</strong></label>
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
            <label htmlFor="end-day"><strong>End day:</strong></label>
            <select
              id="end-day"
              value={selectedEndDay}
              onChange={(e) => setSelectedEndDay(e.target.value)}
            >
              {selectedAvailability
                .filter(
                  (slot) =>
                    getDayIndex(slot.day) >= getDayIndex(selectedStartDay)
                )
                .map((slot) => (
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

        <AvailabilityCard availability={selectedAvailability} />

        <div className="booking-button-wrap">
          <button className="booking-button" onClick={handleBook}>
            Book
          </button>
        </div>
      </section>

      {myBookings.length > 0 && (
        <section className="booking-section">
          <h2>My Bookings</h2>
          <BookingList bookings={myBookings} onUnbook={handleUnbook} />
        </section>
      )}
    </main>
  );
}
