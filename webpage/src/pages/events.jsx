import React from "react";
import EventCard from '../components/EventCard';

export default function Events() {
  // funksjon som håndterer booking
  const handleBook = (eventId) => {
    console.log('Book event med id:', eventId);
    // her kan du f.eks navigere til booking-side eller åpne en modal
  }

  const events = [
    { id: 1, title: 'Konsert', date: '10. mars', eventImg: '/images/event1.jpg', description: 'Info om event'},
    { id: 2, title: 'Konsert', date: '12. mars', eventImg: '/images/event1.jpg', description: 'Info om event'},
    { id: 3, title: 'Konsert', date: '14. mars', eventImg: '/images/event1.jpg', description: 'Info om event'}
  ];

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