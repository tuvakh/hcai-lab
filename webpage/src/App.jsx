import Home from "./pages/Home.jsx";
import People from "./pages/People.jsx";
import Projects from "./pages/Projects.jsx";
import News from "./pages/News.jsx";
import Booking from "./pages/Booking.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer";
import ScrollToTop from './components/ScrollToTop';
import Admin from "./pages/AdminDashbord.jsx";
import Display from "./pages/Display.jsx";
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
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/people" element={<People />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/news" element={<News />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/display" element={<Display />} />
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
