import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Code, Shield, Terminal, Cpu, ArrowRight } from 'lucide-react'
import { SiReact, SiVite, SiTailwindcss, SiSupabase, SiGit, SiLinux, SiPython, SiDocker } from 'react-icons/si'
import { Renderer, Program, Mesh, Triangle } from 'ogl'
import TypingAnimation from '../components/TypingAnimation'
import ElectricBorder from '../components/ElectricBorder'
import LogoLoop from '../components/LogoLoop'
import ScrollReveal from '../components/ScrollReveal'
import BlogCard from '../components/BlogCard'
import SkeletonCard from '../components/SkeletonCard'
import { getPosts } from '../lib/api'

// ── Aurora — only 6-digit hex, no alpha suffix (ogl Color can't parse 8-digit) ──
const VERT = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`
const FRAG = `#version 300 es
precision highp float;
uniform float uTime;
uniform float uAmplitude;
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec2 uResolution;
uniform float uBlend;
out vec4 fragColor;

vec3 permute(vec3 x){return mod(((x*34.0)+1.0)*x,289.0);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)),x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1; i=mod(i,289.);
  vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
  m=m*m*m*m;
  vec3 x=2.*fract(p*C.www)-1.,h=abs(x)-0.5,ox=floor(x+0.5),a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.*dot(m,g);
}
void main(){
  vec2 uv=gl_FragCoord.xy/uResolution;
  vec3 ramp=uv.x<0.5?mix(uC0,uC1,uv.x*2.):mix(uC1,uC2,(uv.x-.5)*2.);
  float h=snoise(vec2(uv.x*2.+uTime*.08,uTime*.18))*.5*uAmplitude;
  h=exp(h); h=uv.y*2.-h+0.2;
  float intensity=0.5*h;
  float alpha=smoothstep(.20-uBlend*.5,.20+uBlend*.5,intensity);
  fragColor=vec4(intensity*ramp*alpha,alpha*0.75);
}
`

// Convert 6-digit hex string to [r,g,b] floats — no ogl Color needed
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

function AuroraBackground() {
  const ctnRef = useRef(null)
  useEffect(() => {
    const ctn = ctnRef.current
    if (!ctn) return

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: false })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;'
    ctn.appendChild(gl.canvas)

    const geometry = new Triangle(gl)
    // Remove uv attribute if present — not needed by our shader
    if (geometry.attributes.uv) delete geometry.attributes.uv

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime:       { value: 0 },
        uAmplitude:  { value: 1.1 },
        uC0:         { value: hexToRgb('#001810') }, // deep dark green
        uC1:         { value: hexToRgb('#003822') }, // mid green
        uC2:         { value: hexToRgb('#001018') }, // dark blue-green
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend:      { value: 0.55 },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })

    function resize() {
      const w = ctn.offsetWidth, h = ctn.offsetHeight
      renderer.setSize(w, h)
      program.uniforms.uResolution.value = [w, h]
    }
    window.addEventListener('resize', resize)
    resize()

    const start = performance.now()
    let id
    function tick() {
      id = requestAnimationFrame(tick)
      program.uniforms.uTime.value = (performance.now() - start) / 1000
      renderer.render({ scene: mesh })
    }
    tick()

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', resize)
      if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return (
    <div
      ref={ctnRef}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    />
  )
}

// ── Static data ────────────────────────────────────────────────────────────────
const typingWords = [
  'full stack systems',
  'secure infrastructure',
  'real products',
  'open source tools',
  'CTF challenges',
]

const domains = [
  { icon: Code,     title: 'Web Development',       description: 'Full stack apps, APIs, and production systems',                      color: '#00ff88' },
  { icon: Shield,   title: 'InfoSec & CTF',          description: 'Security research, CTF competitions, penetration testing',           color: '#ff6b6b' },
  { icon: Terminal, title: 'System Administration',  description: 'Linux, servers, networking, DevOps pipelines',                      color: '#ffd93d' },
  { icon: Cpu,      title: 'Open Source & AI',       description: 'Building tools, contributing to OSS, exploring AI applications',    color: '#6bcfff' },
]

const logos = [
  { node: <SiReact />,       title: 'React',       href: 'https://react.dev' },
  { node: <SiVite />,        title: 'Vite',        href: 'https://vitejs.dev' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com' },
  { node: <SiSupabase />,    title: 'Supabase',    href: 'https://supabase.com' },
  { node: <SiGit />,         title: 'Git',         href: 'https://git-scm.com' },
  { node: <SiLinux />,       title: 'Linux',       href: 'https://kernel.org' },
  { node: <SiPython />,      title: 'Python',      href: 'https://python.org' },
  { node: <SiDocker />,      title: 'Docker',      href: 'https://docker.com' },
]

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Home() {
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  useEffect(() => {
    document.title = 'Kamand Prompt — Dev Cell IIT Mandi'
    let mounted = true
    getPosts(true).then(({ data }) => {
      if (mounted) { setPosts((data || []).slice(0, 3)); setLoadingPosts(false) }
    })
    return () => { mounted = false }
  }, [])

  return (
    <div style={{ background: '#080a0c', overflowX: 'hidden' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>

        <AuroraBackground />

        {/* Dot-grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Bottom fade to page bg */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, pointerEvents: 'none', background: 'linear-gradient(to bottom, transparent, #080a0c)' }} />

        {/* Content — left-aligned */}
        <div style={{
          position: 'relative', zIndex: 2,
          width: '100%', maxWidth: 1280, margin: '0 auto',
          padding: 'clamp(100px,16vw,140px) clamp(24px,6vw,80px) 80px',
        }}>

          {/* Live badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.18)', borderRadius: 100, marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88', animation: 'kpPulse 2s infinite' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem', color: '#00ff88', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              KAMAND PROMPT · IIT Mandi
            </span>
          </div>

          {/* Heading — smaller, readable */}
          <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#eef6ff', lineHeight: 1.1, letterSpacing: '-0.025em', margin: '0 0 18px', maxWidth: 600 }}>
            <span style={{ display: 'block', fontSize: 'clamp(1.9rem, 4.5vw, 3.4rem)', animation: 'kpFadeUp 0.5s ease both', animationDelay: '0.08s' }}>We Build.</span>
            <span style={{ display: 'block', fontSize: 'clamp(1.9rem, 4.5vw, 3.4rem)', animation: 'kpFadeUp 0.5s ease both', animationDelay: '0.2s',  color: '#b8eed4' }}>We Break.</span>
            <span style={{ display: 'block', fontSize: 'clamp(1.9rem, 4.5vw, 3.4rem)', animation: 'kpFadeUp 0.5s ease both', animationDelay: '0.32s' }}>We Learn.</span>
          </h1>

          {/* Typing line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, animation: 'kpFadeUp 0.5s ease both', animationDelay: '0.46s' }}>
            <span style={{ color: '#2a4a38', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem' }}>→</span>
            <TypingAnimation words={typingWords} />
          </div>

          {/* Description */}
          <p style={{ color: '#5a7870', fontSize: 'clamp(0.82rem, 1.4vw, 0.93rem)', lineHeight: 1.75, maxWidth: 460, margin: '0 0 32px', animation: 'kpFadeUp 0.5s ease both', animationDelay: '0.58s' }}>
            The tech club of IIT Mandi. We build real things, break systems to understand them, and ship open source work that matters.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, animation: 'kpFadeUp 0.5s ease both', animationDelay: '0.68s' }}>
            <Link
              to="/team"
              style={{ padding: '10px 22px', borderRadius: 8, background: '#00ff88', color: '#000', fontWeight: 600, fontSize: '0.87rem', textDecoration: 'none', transition: 'background 0.15s, transform 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#00e87a'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#00ff88'; e.currentTarget.style.transform = 'none' }}
            >
              Meet the Team →
            </Link>
            <Link
              to="/events"
              style={{ padding: '10px 22px', borderRadius: 8, background: 'transparent', color: '#c0d8e8', border: '1px solid #1e3040', fontWeight: 500, fontSize: '0.87rem', textDecoration: 'none', transition: 'border-color 0.15s, color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,136,0.35)'; e.currentTarget.style.color = '#00ff88' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e3040'; e.currentTarget.style.color = '#c0d8e8' }}
            >
              View Events →
            </Link>
          </div>
        </div>

        <style>{`
          @keyframes kpFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
          @keyframes kpPulse  { 0%,100%{opacity:1} 50%{opacity:0.35} }
        `}</style>
      </section>

      {/* ── WHAT WE DO ───────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(56px,8vw,96px) 0', background: '#080a0c' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(20px,5vw,64px)' }}>
          <ScrollReveal>
            <div style={{ marginBottom: 40 }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.63rem', color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
                What We Do
              </p>
              <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(1.3rem, 2.8vw, 1.9rem)', fontWeight: 700, color: '#e0eef8', margin: 0, letterSpacing: '-0.02em' }}>
                The domains we live in
              </h2>
            </div>
          </ScrollReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 18 }}>
            {domains.map((d, i) => (
              <ScrollReveal key={d.title} delay={0.08 * (i + 1)}>
                <ElectricBorder color={d.color} speed={0.7} chaos={0.06} thickness={1.5} style={{ borderRadius: 16 }}>
                  <div style={{ background: '#0b1016', borderRadius: 16, padding: 'clamp(18px,2.5vw,26px)' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${d.color}12`, border: `1px solid ${d.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                      <d.icon size={20} style={{ color: d.color }} />
                    </div>
                    <h3 style={{ fontFamily: "'JetBrains Mono', monospace", color: '#e0eef8', fontSize: '0.9rem', fontWeight: 600, margin: '0 0 7px' }}>
                      {d.title}
                    </h3>
                    <p style={{ color: '#5a7280', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
                      {d.description}
                    </p>
                  </div>
                </ElectricBorder>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUILT WITH ───────────────────────────────────────────────────── */}
      <section style={{ padding: '36px 0', background: '#050709', borderTop: '1px solid #0e1520', borderBottom: '1px solid #0e1520' }}>
        <p style={{ textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#243040', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 22 }}>
          Built With
        </p>
        <LogoLoop
          logos={logos}
          speed={70}
          direction="left"
          logoHeight={38}
          gap={52}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="#050709"
        />
      </section>

      {/* ── LATEST RESOURCES ─────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(56px,8vw,96px) 0', background: '#080a0c' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(20px,5vw,64px)' }}>
          <ScrollReveal>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
              <div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.63rem', color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
                  Latest
                </p>
                <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(1.3rem, 2.8vw, 1.9rem)', fontWeight: 700, color: '#e0eef8', margin: 0, letterSpacing: '-0.02em' }}>
                  From the Team
                </h2>
              </div>
              <Link
                to="/resources"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#00ff88', fontSize: '0.8rem', textDecoration: 'none', fontFamily: "'JetBrains Mono', monospace", opacity: 0.8, transition: 'opacity 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.8'}
              >
                View All <ArrowRight size={13} />
              </Link>
            </div>
          </ScrollReveal>

          {loadingPosts ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 18 }}>
              {[1, 2, 3].map(i => <SkeletonCard key={i} type="blog" />)}
            </div>
          ) : posts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 18 }}>
              {posts.map((post, i) => (
                <ScrollReveal key={post.id} delay={0.08 * (i + 1)} inline>
                  <BlogCard {...post} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#2a3a48', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }}>
              Resources coming soon.
            </div>
          )}
        </div>
      </section>

    </div>
  )
}