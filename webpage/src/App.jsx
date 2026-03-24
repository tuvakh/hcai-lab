import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/Home.jsx";
import People from "./pages/People.jsx";
import Projects from "./pages/Projects.jsx";
import News from "./pages/News.jsx";
import Booking from "./pages/Booking.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer";
import ScrollToTop from './components/ScrollToTop';
import Admin from "./pages/AdminDashbord.jsx";
//http://localhost:5173/Admin 

// Removed duplicate App function and default export
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname === "/Admin";

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/People" element={<People />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/News" element={<News />} />
        <Route path="/Booking" element={<Booking />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
      {!isAdmin && <Footer />}
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
