import React from "react";
import EventCard from './../components/EventCard';

export default function Events() {
  // funksjon som håndterer booking
  const handleBook = (eventId) => {
    console.log('Book event med id:', eventId);
    // her kan du f.eks navigere til booking-side eller åpne en modal
  }

  const events = [
    { id: 1, title: 'Konsert', date: '10. mars', eventImg: '/images/event1.jpg', description: 'Info om event'}
  ];

  return (
    <div className="events-section">
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
  );
}