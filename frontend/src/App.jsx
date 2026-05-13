import Home from "./pages/Home.jsx";
import People from "./pages/People.jsx";
import Projects from "./pages/Projects.jsx";
import News from "./pages/News.jsx";
import Booking from "./pages/Booking.jsx";
import Events from "./pages/Event.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer";
import Admin from "./pages/AdminDashboard.jsx";
import Display from "./pages/Display.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import UserPage from "./pages/UserPage.jsx";

import useScrollToTop from './hooks/useScrollToTop.js';

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";

function Layout() {
  useScrollToTop(); 
  const location = useLocation();
  const isAdmin = location.pathname.toLowerCase().startsWith("/admin");
  const isDisplay = location.pathname === "/display";

  return (
    <>
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
        <Route path="/userpage" element={<UserPage />} />
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
