import Home from "./pages/Home.jsx";
import People from "./pages/People.jsx";
import Projects from "./pages/Projects.jsx";
import News from "./pages/News.jsx";
import Booking from "./pages/Booking.jsx";
import Events from "./pages/Event.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer";
import ScrollToTop from './components/ScrollToTop';
import Admin from "./pages/AdminDashbord.jsx";
import Display from "./pages/Display.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import MyBookings from "./pages/MyBookings.jsx";

//http://localhost:5173/Admin

// Removed duplicate App function and default export

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.toLowerCase().startsWith("/admin");
  const isDisplay = location.pathname === "/display";

  return (
    <>
    <ScrollToTop /> 
      {!isAdmin && !isDisplay && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/people" element={<People />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/news" element={<News />} />
        <Route path="/events" element={<Events />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/display" element={<Display />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
      {!isAdmin && !isDisplay && <Footer />}
    </>
  );
}
function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
