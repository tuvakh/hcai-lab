// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminStatCard from "../components/AdminStatCard";
import AdminEventsTable from "../components/AdminEventsTable";
import AdminProjectsTable from "../components/AdminProjectsTable";
import AdminPeopleTable from "../components/AdminPeopleTable";
import AdminEquipmentTable from "../components/AdminEquipmentTable";
import AdminEquipmentBookingsTable from "../components/AdminEquipmentBookingsTable";
import AdminSeatBookingsTable from "../components/AdminSeatBookingsTable";

import Button from "../components/Buttons";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

function LoginGate({ onLogin }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: input }),
      });
      if (!res.ok) {
        setError(true);
        setInput("");
        return;
      }
      const { token } = await res.json();
      sessionStorage.setItem("adminToken", token);
      onLogin(token);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login__form" onSubmit={handleSubmit}>
        <p className="admin-login__label">Dashboard</p>
        <h1 className="admin-login__title">Admin Login</h1>
        <input
          className="admin-login__input"
          type="password"
          placeholder="Password"
          value={input}
          autoFocus
          onChange={(e) => { setInput(e.target.value); setError(false); }}
        />
        {error && <p className="admin-login__error">Incorrect password</p>}
        <button className="admin-login__btn" type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem("adminToken"));
  const [activeTab, setActiveTab] = useState("Overview");
  const [projects, setProjects] = useState([]);
  const [people, setPeople] = useState([]);
  const [events, setEvents] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [equipmentBookings, setEquipmentBookings] = useState([]);
  const [seatBookings, setSeatBookings] = useState([]);

  useEffect(() => {
    if (!authed) return;

    fetch(`${API_URL}/api/projects`)
      .then((response) => response.json())
      .then(setProjects)
      .catch(() => {});

    fetch(`${API_URL}/api/people`)
      .then((response) => response.json())
      .then(setPeople)
      .catch(() => {});

    fetch(`${API_URL}/api/events`)
        .then((response) => response.json())
.then((data) => setEvents(data.sort((a, b) => {
    const now = new Date();
    const aIsPast = new Date(a.date) < now;
    const bIsPast = new Date(b.date) < now;
    if (aIsPast !== bIsPast) return aIsPast ? 1 : -1;
    return new Date(a.date) - new Date(b.date);
})))
        .catch(() => {});

    fetch(`${API_URL}/api/equipment`)
      .then((response) => response.json())
      .then(setEquipments)
      .catch(() => {});

    fetch(`${API_URL}/api/bookings`, {
  headers: { Authorization: `Bearer ${sessionStorage.getItem("adminToken")}` },
})
  .then(r => r.json())
  .then(data => {
    setEquipmentBookings(data.filter(b => b.type === "equipment"));
    setSeatBookings(data.filter(b => b.type === "seat"));
  })
  .catch(() => {});

  }, [authed]);

  if (!authed) return <LoginGate onLogin={() => setAuthed(true)} />;

  return (
    <main className="admin-page">

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className="admin-page__sidebar">
        <Button text="Log out" action={() => { sessionStorage.removeItem("adminToken"); navigate("/"); }} variant="secondary"/>
      </aside>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="admin-page__body">

        <header className="admin-page__header">
          <p className="admin-page__header--label">Dashboard</p>
          <h1 className="admin-page__header--title">Admin</h1>
        </header>

        <section className="admin-page__content">

          {activeTab !== "Overview" && (
            <Button text="← Back" className="admin-page__back-btn" action={() => setActiveTab("Overview")} variant="secondary" size="small" />
          )}

          {/* ── Overview ────────────────────────────────────────────────── */}
          {activeTab === "Overview" && (
            <div role="tabpanel">
              <div className="admin-page__stats">
                <AdminStatCard label="Employees"  value={people.length}    onClick={() => setActiveTab("People")} />
                <AdminStatCard label="Projects"   value={projects.length}  onClick={() => setActiveTab("Projects")} />
                <AdminStatCard label="Events"     value={events.length}    onClick={() => setActiveTab("Events")} />
                <AdminStatCard label="Equipment"  value={equipments.length}   onClick={() => setActiveTab("Equipment")} />
                <AdminStatCard label="Booked equipment"   value={equipmentBookings.length}     onClick={() => setActiveTab("Booked equipment")} />
                <AdminStatCard label="Booked seats" value={seatBookings.length} onClick={() => setActiveTab("Booked seats")} />
              </div>
            </div>
          )}

          {/* ── People ──────────────────────────────────────────────────── */}
          {activeTab === "People" && (
              <AdminPeopleTable people={people} setPeople={setPeople} />
          )}

          {/* ── Projects ────────────────────────────────────────────────── */}
          {activeTab === "Projects" && (
              <AdminProjectsTable projects={projects} setProjects={setProjects} />
          )}

          {/* ── Events ──────────────────────────────────────────────────── */}
          {activeTab === "Events" && (
                <AdminEventsTable events={events} setEvents={setEvents} seatBookings={seatBookings} />
          )}

          {/* ── Equipment ───────────────────────────────────────────────── */}
          {activeTab === "Equipment" && (
                <AdminEquipmentTable equipments={equipments} setEquipments={setEquipments} />
          )}

          {/* ── Bookings ────────────────────────────────────────────────── */}
          {activeTab === "Booked equipment" && (
                <AdminEquipmentBookingsTable bookings={equipmentBookings} setBookings={setEquipmentBookings} />
          )}

          {activeTab === "Booked seats" && (
                <AdminSeatBookingsTable bookings={seatBookings} setBookings={setSeatBookings} events={events} />
          )}


        </section>
      </div>
    </main>
  );
}
