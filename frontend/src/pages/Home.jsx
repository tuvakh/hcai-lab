import { useState, useEffect } from "react";
import EventCard from '../components/EventCard';
import HeroSection from '../components/HeroSection';
import Buttons from "../components/Buttons";
import NewsCard from "../components/NewsCard";
import { useNews } from "../hooks/useNews";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router";
import NewsModal from "../components/NewsModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Home() {
    const navigate = useNavigate();
    const { items, loading, error } = useNews("international");
    const top3News = items.slice(0, 6);
    const [activeItem, setActiveItem] = useState(null);
    const [events, setEvents] = useState([]);

    useEffect(() => {
    fetch(`${API_URL}/api/events`)
        .then((response) => response.json())
        .then((data) => setEvents(data.sort((earlierEvent, laterEvent) => new Date(earlierEvent.date) - new Date(laterEvent.date))))
        .catch(() => {});
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
    <HeroSection heroImg="/assets/hero/hero-home.png">
        <img className="heroSection__intro--logo" src={logo} alt="Logo" />
        <p className="heroSection__intro--text">Our mission is to design and evaluate AI systems with and for people, focusing on aligning technology with human needs and values</p>
    </HeroSection>

    <section className="card-section">
        <div className="card-section__flex">
            <div>
                <h2>News</h2>
                <p>The latest in AI, tech and student opportunities — curated for HCAI.</p>
            </div>
            <div>
                <Buttons
                    text="More news"
                    variant="primary"
                    size="large"
                    className="info-btn"
                    action={() => navigate("/news")} 
                />
            </div>
        </div>
        <div className="news-rail__track">
            {top3News.map(item => (
            <NewsCard
                key={item.id}
                item={item}
                saved={false}  
                onOpen={(item) => setActiveItem(item)}
                isFeatured={item.id === 1}
            />
            ))}
        </div>
    </section>

    <HeroSection heroImg="/assets/hero/project-hero.jpg">
        <h2 className="heroSection__intro--title">Projects</h2>
        <p className="heroSection__intro--text">Exploring the intersection of human-centred design and artificial
          intelligence through applied research and industry collaboration.</p>
        <Buttons
            text="Read more"
            variant="white"
            size="large"
            className="info-btn"
            action={() => navigate("/projects")} 
        />
    </HeroSection>
    
    <section className="card-section">
        <div>
            <h2>Events</h2>
            <p>We organize workshops, teaching sessions, and TED Talks related to AI!</p>
        </div>
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
            onBooked={handleSeatBooked}          />
        ))}
        </div>
    </section>

    <section className="info-section">
        <div className="info-section__contact">
            <div className="info-section__box">
                <div className="info-section__info">
                    <h2>Contact our team</h2>
                    <p>We have a team full of AI interested professionals that are happy to help!</p>
                    <Buttons
                        text="More info"
                        variant="white"
                        size="large"
                        className="info-btn"
                        action={() => navigate("/people")} 
                    />
                </div>
            </div>
        </div>
        <div>
            <div className="info-section__box">
                <div className="info-section__info">
                    <h2>Book equipment</h2>
                    <p>The lab has a lot of different technology related equipment that you can book!</p>
                    <Buttons
                        text="Book here"
                        variant="white"
                        size="large"
                        className="info-btn"
                        action={() => navigate("/booking")} 
                    />
                </div>
            </div>
        </div>
    </section>
    <NewsModal item={activeItem} onClose={() => setActiveItem(null)} />
    </>
  );
}
