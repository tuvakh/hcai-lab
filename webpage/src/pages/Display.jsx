import { useState, useEffect } from "react";
import EventCard from '../components/EventCard';
import HeroSection from '../components/HeroSection';
import NewsCard from "../components/NewsCard";
import { useNews } from "../hooks/useNews";
import logo from "../assets/logo.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Home() {
    const { items } = useNews("international");
    const newsItems = items.slice(0, 5);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const [events, setEvents] = useState([]);
    const [equipments, setEquipments] = useState([]);
    const [bookings, setBookings] = useState([]);


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

    useEffect(() => {
        fetch(`${API_URL}/api/equipment`)
            .then(r => r.json())
            .then(setEquipments)
            .catch(() => {});
    }, []);

    function fetchBookings() {
        fetch(`${API_URL}/api/bookings`)
            .then(r => r.json())
            .then(setBookings)
            .catch(() => {});
    }

    useEffect(() => {
        fetchBookings();
        const interval = setInterval(fetchBookings, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (newsItems.length === 0) return;
        const timer = setInterval(() => {
            setCurrentNewsIndex(i => (i + 1) % newsItems.length);
        }, 10000);
        return () => clearInterval(timer);
    }, [newsItems.length]);


    const nextEvent = events.slice(0, 1);

    function isBookedToday(equipmentId) {
        const today = new Date().toISOString().split("T")[0];
        return bookings.some(b =>
            b.equipmentId === equipmentId &&
            today >= b.startDate.split("T")[0] &&
            today <= b.endDate.split("T")[0]
        );
    }

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
                        <span className={`display-equipment__circle display-equipment__circle--${isBookedToday(item.id) ? "booked" : "available"}`} />
                    </div>
                ))}
            </div>
        </section>

        <section className="display-section display-section--news">
            <h2 className="display-h2">Relevant AI news</h2>
            
            <div>
                {newsItems[currentNewsIndex] && (
                    <NewsCard
                        variant="display"
                        key={newsItems[currentNewsIndex].id}
                        item={newsItems[currentNewsIndex]}
                        saved={false}
                        isFeatured={currentNewsIndex === 0}
                    />
                )}
            </div>
        </section>
    </div>
    </>
  );
}
