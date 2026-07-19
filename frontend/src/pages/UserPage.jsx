import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import BookingList from "../components/BookingList";
import { useNews } from "../hooks/useNews";
import NewsCard from "../components/NewsCard";
import NewsModal from "../components/NewsModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function UserPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [error, setError] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [profile, setProfile] = useState(null);

  const equipmentBookings = bookings.filter(booking => booking.type === "equipment");
  const eventBookings = bookings.filter(booking => booking.type === "seat");

  const { items: norItems } = useNews("norway");
  const { items: intlItems } = useNews("international");
  const allArticles = [...(norItems || []), ...(intlItems || [])];
  const savedArticles = allArticles.filter(article => favoriteIds.includes(article.id));

  useEffect(() => {
    if (!token) {
      navigate("/login", { state: { from: location.pathname } })
      return;
    }
    fetch(`${API_URL}/api/bookings?email=${user.email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setBookings)
      .catch(() => setError("Could not load bookings"));

    fetch(`${API_URL}/api/auth/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setFavoriteIds)
      .catch(() => { });

    fetch(`${API_URL}/api/auth/user`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setProfile);
  }, [token]);

  async function handleUnbook(id) {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) return;
    await fetch(`${API_URL}/api/bookings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setBookings(prev => prev.filter(booking => booking.id !== id));
  }


  async function handleUnfavorite(article) {
    const confirmed = window.confirm("Remove this article from favorites?");
    if (!confirmed) return;
    await fetch(`${API_URL}/api/auth/favorites/${article.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavoriteIds(prev => prev.filter(id => id !== article.id));
  }

  if (error) return <p>{error}</p>;

  return (
    <main className="user-page">
      <section className="user-page__header">
        <h1 className="user-page__title">Welcome, {profile?.name || "My Profile"}</h1>
        <p className="user-page__email">{user?.email}</p>
      </section>

      <section className="user-page__section">
        <h2 className="user-page__section-title">Equipment Bookings</h2>
        {equipmentBookings.length === 0 ? (
          <p className="user-page__empty">No equipment bookings yet.</p>
        ) : (
          <BookingList bookings={equipmentBookings} onUnbook={handleUnbook} showUnbook />
        )}
      </section>

      <section className="user-page__section">
        <h2 className="user-page__section-title">Seat Bookings</h2>
        {eventBookings.length === 0 ? (
          <p className="user-page__empty">No seat bookings yet.</p>
        ) : (
          <BookingList bookings={eventBookings} onUnbook={handleUnbook} showUnbook />
        )}
      </section>


      <section className="user-page__section">
        <h2 className="user-page__section-title">Saved Articles</h2>
        {savedArticles.length === 0 ? (
          <p className="user-page__empty">No saved articles yet.</p>
        ) : (
          <div className="user-page__articles">
            {savedArticles.map(article => (
              <NewsCard
                key={article.id}
                item={article}
                saved={true}
                onStar={handleUnfavorite}
                onOpen={setActiveArticle}
                token={token}
              />
            ))}
          </div>
        )}
        <NewsModal item={activeArticle} onClose={() => setActiveArticle(null)} />
      </section>
    </main>
  );
}

export default UserPage;
