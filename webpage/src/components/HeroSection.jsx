export default function HeroSection({ heroImg, children }) {
    return (
        <section className="heroSection img-overlay img-overlay--hero" style={{ backgroundImage: `url(${heroImg})` }}>
            <div className="heroSection__overlay" />
            <div className="heroSection__intro">
                {children}
            </div>
        </section>
    );
}