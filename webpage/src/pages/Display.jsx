import { useState } from "react";
import { events } from '../data/eventData';
import EventCard from '../components/EventCard';
import HeroSection from '../components/HeroSection';
import NewsCard from "../components/NewsCard";
import { useNews } from "../hooks/useNews";
import logo from "../assets/logo.png";
import NewsModal from "../components/NewsModal";

export default function Home() {
    const { items, loading, error } = useNews("international");
    const top3News = items.slice(0, 6);
    const [activeItem, setActiveItem] = useState(null);

  return (
    <>
    <HeroSection heroImg="/assets/hero/hero-home.png">
        <img className="heroSection__intro--logo" src={logo} alt="Logo" />
        <p className="heroSection__intro--text">Our mission is to design and evaluate AI systems with and for people, focusing on aligning technology with human needs and values</p>
    </HeroSection>

    <section className="card-section">
        <div className="qr-code">

        </div>
        <div className="qr-code">
            
        </div>
        <div className="qr-code">
            
        </div>
    </section>

    <section className="card-section">
        <div className="card-section__info">
            <h2>Events</h2>
            <p>We organize workshops, teaching sessions, and TED Talks related to AI!</p>
        </div>
        <div className="card-section__grid">
        {events.map(event => (
            <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            place={event.place}
            description={event.description}
            eventImg={event.eventImg}
            maxSeats={event.maxSeats}            />
        ))}
        </div>
    </section>

    <section className="info-section">
        <div>
            <div className="booking-item">
            </div>
            <div className="booking-item">
            </div>
            <div className="booking-item">
            </div>
        </div>
        <div>
            <div className="booking-item">
            </div>
            <div className="booking-item">
            </div>
            <div className="booking-item">
            </div>
        </div>
    </section>
    <section className="card-section">
        <div className="card-section__flex">
            <div>
                <h2>News</h2>
                <p>The latest in AI, tech and student opportunities — curated for HCAI.</p>
            </div>
        </div>
        <div className="news-rail__track">
            {top3News.map(item => (
            <NewsCard
                key={item.id}
                item={item}
                saved={false}  
                onOpen={(item) => setActiveItem(item)}
                isFeatured={item.id === 1} // første artikkel som featured
            />
            ))}
        </div>
    </section>
    <NewsModal item={activeItem} onClose={() => setActiveItem(null)} />
    </>
  );
}
