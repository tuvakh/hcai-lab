export default function HeroSection({ heroImg, children, size }) {
  return (
    <section className={`heroSection ${size ? `heroSection--${size}` : ""} img-overlay img-overlay--hero`} style={{ backgroundImage: `url(${heroImg})` }}>
      <div className="heroSection__intro">
        {children}
      </div>
    </section>
  );
}