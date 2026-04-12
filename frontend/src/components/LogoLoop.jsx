import { useRef, useEffect, useState } from "react";

export default function LogoLoop({
  logos = [],
  speed = 100,
  direction = "left",
  logoHeight = 60,
  gap = 60,
  hoverSpeed = 0,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor = "#0a0a0a",
  ariaLabel = "Logo loop",
}) {
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const animRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const currentSpeed = hovering ? hoverSpeed : speed;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const totalWidth = track.scrollWidth / 2;

    function step() {
      const delta = (currentSpeed / 60 / 10);
      if (direction === "left") {
        posRef.current -= delta;
        if (Math.abs(posRef.current) >= totalWidth) posRef.current = 0;
      } else {
        posRef.current += delta;
        if (posRef.current >= totalWidth) posRef.current = 0;
      }
      track.style.transform = `translateX(${posRef.current}px)`;
      animRef.current = requestAnimationFrame(step);
    }

    animRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animRef.current);
  }, [currentSpeed, direction]);

  const doubled = [...logos, ...logos];

  return (
    <div
      aria-label={ariaLabel}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: logoHeight + 20,
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {fadeOut && (
        <>
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
            background: `linear-gradient(to right, ${fadeOutColor}, transparent)`,
          }} />
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
            background: `linear-gradient(to left, ${fadeOutColor}, transparent)`,
          }} />
        </>
      )}
      <div
        ref={trackRef}
        style={{ display: "flex", alignItems: "center", gap, whiteSpace: "nowrap", willChange: "transform" }}
      >
        {doubled.map((logo, i) => (
          <a
            key={i}
            href={logo.href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            title={logo.title || logo.alt}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              height: logoHeight,
              fontSize: logoHeight * 0.6,
              color: "#888888",
              transition: "color 0.2s, transform 0.2s",
              textDecoration: "none",
              flexShrink: 0,
            }}
            onMouseEnter={e => { if (scaleOnHover) e.currentTarget.style.transform = "scale(1.15)"; e.currentTarget.style.color = "#00ff88"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.color = "#888888"; }}
          >
            {logo.src ? (
              <img src={logo.src} alt={logo.alt} style={{ height: logoHeight, objectFit: "contain" }} />
            ) : (
              logo.node
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
