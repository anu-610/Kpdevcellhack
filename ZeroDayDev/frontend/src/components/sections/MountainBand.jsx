import { Mountain, Sparkles, Trees } from "lucide-react";

export function MountainBand() {
  return (
    <section className="mountain-band" aria-label="IIT Mandi mountain campus note">
      <div className="mountain-band-image" />
      <div className="mountain-band-content">
        <p className="eyebrow">IIT Mandi</p>
        <h2>Code from the hills</h2>
        <p>
          Built for a campus where ideas climb fast, evenings turn pink over the
          mountains, and students keep shipping through the semester rush.
        </p>
        <div className="mountain-points">
          <span>
            <Mountain size={18} />
            Himalayan energy
          </span>
          <span>
            <Trees size={18} />
            Campus builders
          </span>
          <span>
            <Sparkles size={18} />
            Product mindset
          </span>
        </div>
      </div>
    </section>
  );
}
