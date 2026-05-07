import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import BookingList from "../components/BookingList";

function MyBookings() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetch(`http://localhost:3001/api/bookings?email=${user.email}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setBookings)
      .catch(() => setError("Could not load bookings"));
  }, [token]);

    async function handleUnbook(id) {
    await fetch(`http://localhost:3001/api/bookings/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  if (error) return <p>{error}</p>;

  return (
  <main className="my-bookings-page">
    <h1 className="my-bookings-page__title">My Bookings</h1>
    {bookings.length === 0 ? (
      <p className="my-bookings-page__empty">No bookings yet</p>
    ) : (
      <BookingList bookings={bookings} onUnbook={handleUnbook} />
    )}
  </main>
);
}

export default MyBookings;
