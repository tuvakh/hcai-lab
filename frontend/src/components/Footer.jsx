import logo from "../assets/logo.png";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <img src={logo} alt="HCAI logo" className="footer__logo" />

          <div className="footer__content">
            <div>
              <h2 className="footer__heading">General</h2>
              <ul className="footer__list">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/people">People</Link></li>
                <li><Link to="/projects">Projects</Link></li>
                <li><Link to="/news">News</Link></li>
                <li><Link to="/booking">Equipment</Link></li>
              </ul>
            </div>

            <div>
              <h2 className="footer__heading">Address</h2>
              <address className="footer__text">
                Raufossvegen 40, <br />
                2821 Gjøvik
              </address>

              <h2 className="footer__heading footer__heading--contact">Contact</h2>
              <p className="footer__text">
                Sujay Shalawadi <br />
                <a href="mailto:sujay.shalawadi@ntnu.no">
                  sujay.shalawadi@ntnu.no
                </a>
              </p>
            </div>

            <div className="footer__column footer__column--map">
              <iframe
                src="https://www.google.com/maps?q=Raufossvegen+40+Gjøvik&output=embed"
                width="100%"
                height="250"
                title="HCAI Lab location"
                className="footer__map"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        <p className="footer__copyright">© 2026. HCAI - Human-centered AI lab</p>
      </div>
    </footer>
  );
}