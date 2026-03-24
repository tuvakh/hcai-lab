import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import People from "./pages/People.jsx";
import Projects from "./pages/Projects.jsx";
import News from "./pages/News.jsx";
import Booking from "./pages/Booking.jsx";
import Admin from "./pages/AdminDashbord.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer";
import "./components/_footer.scss";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/People" element={<People />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/News" element={<News />} />
        <Route path="/Booking" element={<Booking />} />
        <Route path="/Admin" element={<Admin />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App