import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Events", path: "/events" },
  { label: "People", path: "/people" },
  { label: "Projects", path: "/projects" },
  { label: "News", path: "/news" },
  { label: "Booking", path: "/booking" },
];
//transperant nav bar version 

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className={`navbar${isScrolled ? " navbar--scrolled" : ""}`}>
        <NavLink to="/" className="navbar__logo">
          <img src={logo} alt="HCAI Lab logo" className="navbar__logo-image" />
        </NavLink>

        <button
          type="button"
          className={`navbar__toggle${isOpen ? " navbar__toggle--open" : ""}`}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`navbar__links${isOpen ? " navbar__links--open" : ""}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "navbar__link navbar__link--active"
                    : "navbar__link"
                }
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          {user ? (
            <>
                <li>
                <NavLink to="/my-bookings" className="navbar__link" onClick={closeMenu}>
                    My Bookings
                </NavLink>
                </li>
                <li>
                <button className="navbar__link" onClick={() => { logout(); closeMenu(); }}>
                    Log out
                </button>
                </li>
            </>
            ) : (
            <>
                <li>
                <NavLink to="/login" className="navbar__link" onClick={closeMenu}>
                    Log in
                </NavLink>
                </li>
                <li>
                <NavLink to="/register" className="navbar__link" onClick={closeMenu}>
                    Register
                </NavLink>
                </li>
            </>
            )}
        </ul>
      </nav>
    </>
  );
}
