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

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");

  const [projects, setProjects] = useState([]);
  const [people, setPeople] = useState([]);
  const [events, setEvents] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [equipmentBookings, setEquipmentBookings] = useState([]);
  const [seatBookings, setSeatBookings] = useState([]);
  
  useEffect(() => {
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
        .then((data) => setEvents(data.sort((earlierEvent, laterEvent) => new Date(earlierEvent.date) - new Date(laterEvent.date))))
        .catch(() => {});

    fetch(`${API_URL}/api/equipment`)
      .then((response) => response.json())
      .then(setEquipments)
      .catch(() => {});

    fetch(`${API_URL}/api/bookings`)
        .then(r => r.json())
        .then(data => {
            setEquipmentBookings(data.filter(b => b.type === "equipment"));
            setSeatBookings(data.filter(b => b.type === "seat"));
        })
        .catch(() => {});
  }, []);

  return (
    <main className="admin-page">

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside className="admin-page__sidebar">
        <Button text="Log out" action={() => navigate("/")} variant="secondary"/>
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
                <AdminEventsTable events={events} setEvents={setEvents} />
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
