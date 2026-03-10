import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "People", path: "/People" },
  { label: "Projects", path: "/Projects" },
  { label: "Events", path: "/Events" },
  { label: "News", path: "/News" },
  { label: "Booking", path: "/Booking" },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');

  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: #1C236F;
    box-shadow: 7px 7px 10px rgba(28, 35, 111, 0.5);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2.5rem;
    height: 64px;
  }

  .navbar-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
  }

  .navbar-logo-badge {
    background: #7B3FC4;
    color: #fff;
    font-family: 'Anton', sans-serif;
    font-size: 1rem;
    letter-spacing: 0.08em;
    padding: 0.3rem 0.75rem;
    border-radius: 8px;
    box-shadow: 7px 7px 10px rgba(28, 35, 111, 0.4);
  }

  .navbar-logo-text {
    font-family: 'Anton', sans-serif;
    font-size: 1rem;
    color: #c5c9e8;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .navbar-links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .navbar-links a {
    display: block;
    padding: 0.4rem 1rem;
    border-radius: 12px;
    text-decoration: none;
    font-family: 'Articulat CF', 'Arial', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    color: #a0a8d8;
    letter-spacing: 0.04em;
    transition: background 0.2s, color 0.2s;
    position: relative;
  }

  .navbar-links a:hover {
    background: rgba(255,255,255,0.08);
    color: #fff;
  }

  .navbar-links a.active {
    background: rgba(123, 63, 196, 0.25);
    color: #fff;
  }

  .navbar-links a.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 2px;
    background: #7B3FC4;
    border-radius: 2px;
  }

  /* Push page content below fixed navbar */
  .navbar-spacer {
    height: 64px;
  }
`;

export default function Navbar() {
  return (
    <>
      <style>{styles}</style>
      <nav className="navbar">
        <NavLink to="/" className="navbar-logo">
          <span className="navbar-logo-badge">HCAI</span>
          <span className="navbar-logo-text">Human-Centered AI Lab</span>
        </NavLink>

        <ul className="navbar-links">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => isActive ? "active" : ""}
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
