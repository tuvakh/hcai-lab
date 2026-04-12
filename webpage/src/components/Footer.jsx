import logo from "../assets/logo.png";
export default function Footer() {
    return (
      <footer className="footer">
        <div className="footer__inner">
          <div className="footer__top">
            <div className="footer__brand">
                <img
                    src={logo}
                    alt="HCAI logo"
                    className="footer__logo"
                />
            </div>
  
            <div className="footer__content">
              <div className="footer__column">
                <h3 className="footer__heading">General</h3>
                <ul className="footer__list">
                  <li><a href="/">Home</a></li>
                  <li><a href="/people">People</a></li>
                  <li><a href="/projects">Projects</a></li>
                  <li><a href="/news">News</a></li>
                  <li><a href="/booking">Equipment</a></li>
                </ul>
              </div>
  
              <div className="footer__column">
                <h3 className="footer__heading">Adresse</h3>
                <p className="footer__text">
                  Raufossvegen 40,
                  <br />
                  2821 Gjøvik
                </p>
  
                <h3 className="footer__heading footer__heading--contact">Contact</h3>
                <p className="footer__text">
                  Sujay Shalawadi
                  <br />
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
                    style={{ border: 0, borderRadius: "8px" }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
  
          <div className="footer__bottom">
            <p className="footer__copyright">
              © 2026. HCAI - Human-centered AI lab
            </p>
          </div>
        </div>
      </footer>
    );
  }