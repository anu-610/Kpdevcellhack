export function HeroSection() {
  return (
    <section className="hero-section" id="home">
      <img
        className="hero-image"
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80"
        alt="Mountain landscape at sunset"
      />
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="eyebrow">Kamand Prompt</p>
        <h1>Dev Cell</h1>
        <p>
          IIT Mandi&apos;s student space for building products, learning together, and
          turning hill-born ideas into projects that can live beyond the classroom.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#projects">
            View projects
          </a>
          <a className="secondary-button" href="#login">
            Student login
          </a>
        </div>
      </div>
    </section>
  );
}
