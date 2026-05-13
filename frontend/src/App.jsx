import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer";
import ScrollToTop from './components/ScrollToTop';

const Home     = lazy(() => import("./pages/Home.jsx"));
const People   = lazy(() => import("./pages/People.jsx"));
const Projects = lazy(() => import("./pages/Projects.jsx"));
const News     = lazy(() => import("./pages/News.jsx"));
const Booking  = lazy(() => import("./pages/Booking.jsx"));
const Events   = lazy(() => import("./pages/Event.jsx"));
const Admin    = lazy(() => import("./pages/AdminDashboard.jsx"));
const Display  = lazy(() => import("./pages/Display.jsx"));
const Login    = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const UserPage = lazy(() => import("./pages/UserPage.jsx"));

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.toLowerCase().startsWith("/admin");
  const isDisplay = location.pathname === "/display";

  return (
    <>
      <ScrollToTop />
      {!isAdmin && !isDisplay && <Navbar />}
      <Suspense fallback={null}>
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
      </Suspense>
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
