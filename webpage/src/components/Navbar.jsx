import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const navItems = [
  { label: "Home", path: "/" },
  { label: "People", path: "/People" },
  { label: "Projects", path: "/Projects" },
  { label: "News", path: "/News" },
  { label: "Booking", path: "/Booking" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
        <NavLink to="/" className="navbar-logo">
          <img src={logo} alt="HCAI Lab logo" className="navbar-logo-image" />
          <div className="navbar-logo-text-group">
          </div>
        </NavLink>

        <button
          type="button"
          className={`navbar-toggle${isOpen ? " is-open" : ""}`}
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`navbar-links${isOpen ? " is-open" : ""}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="navbar-spacer" />
    </>
  );
}
