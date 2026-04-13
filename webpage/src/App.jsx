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
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";

function Layout() {
  const location = useLocation();
<<<<<<< HEAD
  const isAdmin = location.pathname === "/Admin";
=======
  const isAdmin = location.pathname.toLowerCase() === "/admin";
  const isDisplay = location.pathname === "/display";
>>>>>>> fca44e807664b885a9846d602e226ebac813e89f

  return (
    <>
    <ScrollToTop /> 
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
<<<<<<< HEAD
        <Route path="/People" element={<People />} />
        <Route path="/Projects" element={<Projects />} />
        <Route path="/News" element={<News />} />
        <Route path="/Booking" element={<Booking />} />
        <Route path="/Admin" element={<Admin />} />
=======
        <Route path="/people" element={<People />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/news" element={<News />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/display" element={<Display />} />
>>>>>>> fca44e807664b885a9846d602e226ebac813e89f
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
