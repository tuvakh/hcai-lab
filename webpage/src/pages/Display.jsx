import { useState, useEffect } from "react";
import EventCard from '../components/EventCard';
import HeroSection from '../components/HeroSection';
import NewsCard from "../components/NewsCard";
import { useNews } from "../hooks/useNews";
import logo from "../assets/logo.png";
import { equipments } from '../data/equipmentData';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Home() {
    const { items } = useNews("international");
    const topNews = items.slice(0, 1);
    const [activeItem, setActiveItem] = useState(null);
    const [events, setEvents] = useState([]);

    function fetchEvents() {
        fetch(`${API_URL}/api/events`)
            .then(r => r.json())
            .then(data => setEvents(data.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date))))
            .catch(() => {});
    }

    useEffect(() => {
        fetchEvents();
        const interval = setInterval(fetchEvents, 30000);
        return () => clearInterval(interval);
    }, []);

    const nextEvent = events.slice(0, 1);

  return (
    <>
    <div className="display-page">
        <HeroSection size="display" heroImg="/assets/hero/hero-home.png">
            <img className="heroSection__intro--logo" src={logo} alt="Logo" />
            <p className="heroSection__intro--text heroSection__intro--displayText">Our mission is to design and evaluate AI systems with and for people, focusing on aligning technology with human needs and values</p>
        </HeroSection>

        <section className="display-section display-section--qr">
            <div className="display-section__qr-info">
                <h2 className="display-h2">Our website</h2>
                <p>Check out our website to book equipment, attend events, look at projects, read news or contact on of our researchers!</p>
            </div>
            <div className="display-section__box">
                <img className="display-section__qr-img" src="/assets/qr-codes/website.png"/>
            </div>
        </section>

        <section className="display-section">
            <h2 className="display-h2">Next event</h2>

            <div className="display-section__grid">
            {nextEvent.map(event => (
                <EventCard 
                variant="display"
                key={event.id}
                title={event.title}
                date={event.date}
                place={event.place}
                description={event.description}
                eventImg={event.eventImg}
                maxSeats={event.maxSeats}            
                />
            ))}
            </div>
        </section>

        <section className="display-section display-equipment">
            <div className="display-equipment__header">
                <h2 className="display-h2">Equipment</h2>
                <div className="display-equipment__legend-box">
                    <span className="display-equipment__legend display-equipment__legend--booked">Booked</span>
                    <span className="display-equipment__legend display-equipment__legend--available">Available</span>
                </div>
            </div>

            <div className="display-equipment__grid">
                {equipments.map(item => (
                    <div key={item.id} className="display-equipment__item">
                        <span>{item.name}</span>
                        <span className="display-equipment__circle display-equipment__circle--available" />
                    </div>
                ))}
            </div>
        </section>

        <section className="display-section">
            <h2 className="display-h2">Relevant AI news</h2>
            
            <div>
                {topNews.map(item => (
                <NewsCard 
                    variant="display"
                    key={item.id}
                    item={item}
                    saved={false}  
                    isFeatured={item.id === 1} // første artikkel som featured
                />
                ))}
            </div>
        </section>
    </div>
    </>
  );
}
