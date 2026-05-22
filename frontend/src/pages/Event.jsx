import { useState, useEffect } from "react";
import EventCard from '../components/EventCard';
import HeroSection from '../components/HeroSection';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/events`)
      .then((response) => response.json())
      .then((data) => {
        const now = new Date();
        setEvents(
          data
            .filter(event => new Date(event.date) >= now)
            .sort((earlierEvent, laterEvent) => new Date(earlierEvent.date) - new Date(laterEvent.date))
        );
      })
      .catch(() => { });
  }, []);

  function handleSeatBooked(eventId, bookedSeats) {
    setEvents(prev => prev.map(event =>
      event.id === eventId
        ? { ...event, seatsLeft: event.seatsLeft - bookedSeats }
        : event
    ));
  }

  return (
    <>
      <HeroSection heroImg="/assets/hero/event-hero.png">
        <p className="heroSection__intro--label">Social</p>
        <h1 className="heroSection__intro--title">Events</h1>
        <p className="heroSection__intro--text">We organize workshops, teaching sessions, and TED Talks related to AI!</p>
      </HeroSection>

      <section className="card-section">
        <div className="card-section__grid">
          {events.map(event => (
            <EventCard
              key={event.id}
              eventId={event.id}
              title={event.title}
              date={event.date}
              place={event.place}
              description={event.description}
              eventImg={event.eventImg}
              maxSeats={event.maxSeats}
              seatsLeft={event.seatsLeft}
              onBooked={handleSeatBooked}
            />
          ))}
        </div>
      </section>
    </>
  );
}
