import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/Home.jsx";
import People from "./pages/People.jsx";
import Projects from "./pages/Projects.jsx";
import News from "./pages/News.jsx";
import Booking from "./pages/Booking.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer";
import "./components/_footer.scss";
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/People" element={<People />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/News" element={<News />} />
        <Route path="/Booking" element={<Booking />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App