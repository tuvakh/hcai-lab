// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminStatCard from "../components/AdminStatCard";
import AdminEventsTable from "../components/AdminEventsTable";
import AdminProjectsTable from "../components/AdminProjectsTable";
import AdminPeopleTable from "../components/AdminPeopleTable";
import AdminEquipmentTable from "../components/AdminEquipmentTable";
import AdminBookingsTable from "../components/AdminBookingsTable";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");

  const [projects, setProjects] = useState([]);
  const [people, setPeople] = useState([]);
  const [events, setEvents] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    fetch(`${API_URL}/api/projects`)
      .then((r) => r.json())
      .then(setProjects)
      .catch(() => {});

    fetch(`${API_URL}/api/people`)
      .then((r) => r.json())
      .then(setPeople)
      .catch(() => {});
    
    fetch(`${API_URL}/api/events`)
        .then((r) => r.json())
        .then((data) => setEvents(data.sort((soon, later) => new Date(soon.date) - new Date(later.date))))
        .catch(() => {});

    fetch(`${API_URL}/api/equipment`)
      .then((r) => r.json())
      .then(setEquipments)
      .catch(() => {});

    fetch(`${API_URL}/api/bookings`)
      .then((r) => r.json())
      .then(setBookings)
      .catch(() => {});
  }, []);

  return (
    <main className="admin-page">

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className="admin-page__sidebar">
        <button
          className="btn btn--secondary"
          onClick={() => navigate("/")}
          type="button"
        >
          Log out
        </button>
      </aside>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="admin-page__body">

        <header className="admin-page__header">
          <p className="admin-page__header--label">Dashboard</p>
          <h1 className="admin-page__header--title">Admin</h1>
        </header>

        <section className="admin-page__content">

          {activeTab !== "Overview" && (
            <button type="button" className="btn btn--secondary" 
              onClick={() => setActiveTab("Overview")}>
              &larr; Back
            </button>
          )}

          {/* ── Overview ────────────────────────────────────────────────── */}
          {activeTab === "Overview" && (
            <div role="tabpanel">
              <div className="admin-page__stats">
                <AdminStatCard label="Employees"  value={people.length}    onClick={() => setActiveTab("People")} />
                <AdminStatCard label="Projects"   value={projects.length}  onClick={() => setActiveTab("Projects")} />
                <AdminStatCard label="Events"     value={events.length}    onClick={() => setActiveTab("Events")} />
                <AdminStatCard label="Equipment"  value={equipments.length}   onClick={() => setActiveTab("Equipment")} />
                <AdminStatCard label="Booked equipment"   value={bookings.length}     onClick={() => setActiveTab("Booked equipment")} />
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
                <AdminEventsTable events={events} setEvents={setEvents} />
          )}

          {/* ── Equipment ───────────────────────────────────────────────── */}
          {activeTab === "Equipment" && (
                <AdminEquipmentTable equipments={equipments} setEquipments={setEquipments} />
          )}

          {/* ── Bookings ────────────────────────────────────────────────── */}
          {activeTab === "Booked equipment" && (
                <AdminBookingsTable bookings={bookings} setBookings={setBookings} />
          )}
        </section>
      </div>
    </main>
  );
}
