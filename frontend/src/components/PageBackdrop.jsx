import MagicRings from './MagicRings'

export default function PageBackdrop() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#05070a',
        }}
      />

      <div style={{ position: 'absolute', inset: 0, opacity: 0.58 }}>
        <MagicRings
          color="#00ff88"
          colorTwo="#0066ff"
          speed={0.45}
          ringCount={6}
          attenuation={10}
          lineThickness={1.35}
          baseRadius={0.15}
          radiusStep={0.072}
          scaleRate={0.085}
          opacity={0.82}
          noiseAmount={0.04}
          followMouse={true}
          mouseInfluence={0.12}
          hoverScale={1.08}
          parallax={0.04}
          clickBurst={true}
        />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: [
            'radial-gradient(circle at 50% 22%, rgba(0,255,136,0.18) 0%, rgba(0,255,136,0.08) 16%, transparent 38%)',
            'radial-gradient(circle at 76% 34%, rgba(0,102,255,0.14) 0%, transparent 33%)',
            'radial-gradient(circle at 24% 34%, rgba(0,255,136,0.12) 0%, transparent 30%)',
            'radial-gradient(circle at 50% 74%, rgba(0,102,255,0.08) 0%, transparent 34%)',
            'linear-gradient(180deg, rgba(5,7,10,0.12) 0%, rgba(5,7,10,0.24) 38%, rgba(10,10,10,0.72) 100%)',
          ].join(','),
        }}
      />

      <div
        className="dot-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.18,
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.72), rgba(0,0,0,0.15))',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.72), rgba(0,0,0,0.15))',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 32%, rgba(10,10,10,0.9) 100%)',
        }}
      />
    </div>
  )
}
