import CardGrid from "../components/CardGrid";
import HeroSection from "../components/HeroSection";
import { people } from "../data/peopleData";

export default function People() {
  return (
    <main className="people-page">
      <HeroSection heroImg="/assets/hero/hero-home.png">
        <p className="heroSection__intro--label">The Team</p>
        <h1 className="heroSection__intro--title">People &amp; Contact</h1>
        <p className="heroSection__intro--text">
          We are a multidisciplinary group of researchers, engineers, and
          students working to make AI systems more transparent, fair, and
          human-centered.
        </p>
      </HeroSection>

      <section className="people-page__grid-section">
        <CardGrid items={people} variant="people" />
      </section>

      <section className="people-page__contact">
        <h2 className="people-page__contact-title">Contact the lab</h2>
        <p className="people-page__contact-text">
          Interested in collaborating or joining the team? We'd love to hear
          from you.
        </p>
        <a href="mailto:hcai@ntnu.no" className="people-page__contact-btn">
          Get in touch
        </a>
      </section>
    </main>
  );
}
