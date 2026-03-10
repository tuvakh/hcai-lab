import React from "react";
import { events } from '../data/eventData';
import EventCard from '../components/EventCard';

export default function Home() {
  /* // funksjon som håndterer booking
  const handleBook = (eventId) => {
    console.log('Book event med id:', eventId);
    // her kan du f.eks navigere til booking-side eller åpne en modal
  } */

  return (
    <>
    <section className="events">
        <div className="events__info">
            <h2>Events</h2>
            <p>We organize workshops, teaching sessions, and TED Talks related to AI!</p>
            <p>Check out our upcoming events to learn more about AI.</p> 
        </div>
        <div className="events__card">
        {events.map(event => (
            <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            place={event.place}
            description={event.description}
            eventImg={event.eventImg}/* 
            bookSeat={() => handleBook(event.id)} */
            />
        ))}
        </div>
    </section>
    </>
  );
}
