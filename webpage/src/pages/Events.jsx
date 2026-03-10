import React from "react";
import EventCard from '../components/EventCard';

export default function Events() {
  const handleBook = (eventId) => {
    // placeholder booking handler
    console.log("Book event med id:", eventId);
  };

  return (
    <>
    <h1>Events</h1>
    <p>Informasjon Informasjon Info Informasjon Info Info Informasjon Informasjon Info Info Info</p>
    <div className="events">
      {events.map(event => (
        <EventCard
          key={event.id}
          title={event.title}
          date={event.date}
          description={event.description}
          eventImg={event.img}/* 
          bookSeat={() => handleBook(event.id)} */
        />
      ))}
    </div>
    </>
  );
}
