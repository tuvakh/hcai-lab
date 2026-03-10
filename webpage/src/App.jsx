import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import Home from "./pages/home.jsx";
import People from "./pages/people.jsx";
import Events from "./pages/Events.jsx";
import Projects from "./pages/projects.jsx";
import News from "./pages/news.jsx";
import Booking from "./pages/booking.jsx";
import Navbar from "./components/Navbar";
=======
import Home from "./pages/Home.jsx";
import People from "./pages/People.jsx";
import Events from "./pages/Events.jsx";
import Projects from "./pages/Projects.jsx";
import News from "./pages/News.jsx";
import Booking from "./pages/Booking.jsx";
import Navbar from "./components/Navbar.jsx";
>>>>>>> origin

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/People" element={<People />} />
        <Route path="/Events" element={<Events />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/News" element={<News />} />
        <Route path="/Booking" element={<Booking />} />
      </Routes>
    </Router>
  );
}

export default App