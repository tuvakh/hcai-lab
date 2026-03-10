import React from "react";
import { events } from '../data/eventData';
import EventCard from '../components/EventCard';
import HeroSection from '../components/HeroSection';
import logo from "../assets/logo.png";

export default function Home() {
  /* // funksjon som håndterer booking
  const handleBook = (eventId) => {
    console.log('Book event med id:', eventId);
    // her kan du f.eks navigere til booking-side eller åpne en modal
  } */

  return (
    <>
    <HeroSection heroImg="/assets/hero/hero-home.png">
        <img className="heroSection__intro--logo" src={logo} alt="Logo" />
        <p className="heroSection__intro--text">Our mission is to design and evaluate AI systems with and for people, focusing on aligning technology with human needs and values</p>
    </HeroSection>

    <section className="card-section">
        <div className="card-section_info">
            <h2>News</h2>
            <p>Text text text</p>
            <p>Text text text</p> 
        </div>
    </section>

    <HeroSection heroImg="/assets/projects.png">
        <h2 className="heroSection__intro--title">Projects</h2>
        <p className="heroSection__intro--text">Text text text</p>
    </HeroSection>
    
    <section className="card-section">
        <div className="card-section__info">
            <h2>Events</h2>
            <p>We organize workshops, teaching sessions, and TED Talks related to AI!</p>
            <p>Check out our upcoming events to learn more about AI.</p> 
        </div>
        <div className="card-section__grid">
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

    <section className="info-section">
        <div className="info-section__contact">
            <h2>Contact</h2>
            <p>Text text text</p>
            <p>Text text text</p> 
        </div>
        <div className="info-section__booking">
            <h2>Book equipment</h2>
            <p>Text text text</p>
            <p>Text text text</p> 
        </div>
    </section>
    </>
  );
}
