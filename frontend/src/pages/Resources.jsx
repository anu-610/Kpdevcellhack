import { useEffect, useState } from 'react'
import { BookOpen, Trophy, FolderOpen } from 'lucide-react'
import BlogCard from '../components/BlogCard'
import AchievementCard from '../components/AchievementCard'
import PageBackdrop from '../components/PageBackdrop'
import ScrollReveal from '../components/ScrollReveal'
import SkeletonCard from '../components/SkeletonCard'
import { getAchievements, getPosts, getProjects } from '../lib/api'

// Simple ProjectCard matching the style of AchievementCard
function ProjectCard({ title, description, tech_tags, github_url, live_url, image_url }) {
  return (
    <div style={{
      background: '#0b1016',
      borderRadius: 14,
      border: '1px solid #1a2535',
      overflow: 'hidden',
      transition: 'transform 0.2s, border-color 0.2s',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00ff8844'; e.currentTarget.style.transform = 'translateY(-3px)' }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1a2535'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {image_url && (
        <img src={image_url} alt={title} style={{ width: '100%', height: 140, objectFit: 'cover', borderBottom: '1px solid #1a2535' }} />
      )}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', fontWeight: 600, color: '#e0eef8', margin: '0 0 6px' }}>
          {title}
        </h3>
        {description && (
          <p style={{ color: '#5a7280', fontSize: '0.8rem', lineHeight: 1.5, margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </p>
        )}
        {tech_tags && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {(typeof tech_tags === 'string' ? tech_tags.split(',') : tech_tags).slice(0, 3).map(tag => (
              <span key={tag} style={{ background: '#0f1820', padding: '2px 8px', borderRadius: 100, fontSize: '0.65rem', color: '#6bcfff', border: '1px solid #1e2a38' }}>
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
          {github_url && (
            <a href={github_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.7rem', color: '#7a8694', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#00ff88'} onMouseLeave={e => e.currentTarget.style.color = '#7a8694'}>
              GitHub →
            </a>
          )}
          {live_url && (
            <a href={live_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.7rem', color: '#7a8694', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#6bcfff'} onMouseLeave={e => e.currentTarget.style.color = '#7a8694'}>
              Live →
            </a>
          )}
          {!github_url && !live_url && <span style={{ fontSize: '0.7rem', color: '#3a4a5a' }}>—</span>}
        </div>
      </div>
    </div>
  )
}

export default function Resources() {
  const [activeTab, setActiveTab] = useState('resources')
  const [posts, setPosts] = useState([])
  const [achievements, setAchievements] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState({ posts: true, achievements: true, projects: true })

  useEffect(() => {
    document.title = 'Resources — KP Dev Cell'
    let mounted = true

    getPosts(true).then(({ data }) => {
      if (mounted) { setPosts(data || []); setLoading(p => ({ ...p, posts: false })) }
    })
    getAchievements().then(({ data }) => {
      if (mounted) { setAchievements(data || []); setLoading(p => ({ ...p, achievements: false })) }
    })
    getProjects().then(({ data }) => {
      if (mounted) { setProjects(data || []); setLoading(p => ({ ...p, projects: false })) }
    })

    return () => { mounted = false }
  }, [])

  const tabs = [
    { id: 'resources',    label: 'Resources',    icon: BookOpen,   count: posts.length,        loadKey: 'posts' },
    { id: 'achievements', label: 'Achievements', icon: Trophy,     count: achievements.length,  loadKey: 'achievements' },
    { id: 'projects',     label: 'Projects',     icon: FolderOpen, count: projects.length,      loadKey: 'projects' },
  ]

  return (
    <div style={{ position: 'relative', background: '#080a0c', minHeight: '100vh' }}>
      <PageBackdrop />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ height: 62 }} />

        {/* Page header — full width container */}
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: 'clamp(44px,7vw,72px) clamp(20px,4vw,60px) 0', boxSizing: 'border-box' }}>
          <ScrollReveal>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.63rem', color: 'rgba(0,255,136,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>
              Library
            </p>
            <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 700, color: '#e0eef8', letterSpacing: '-0.025em', margin: '0 0 10px' }}>
              Resources & Achievements
            </h1>
            <p style={{ color: '#5a7280', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: 500, margin: 0 }}>
              Notes, tutorials, writeups from the club — and the wins along the way.
            </p>
          </ScrollReveal>

          {/* Tab switcher */}
          <div style={{ marginTop: 28, display: 'inline-flex', gap: 3, padding: '4px', background: '#0b1016', border: '1px solid #1a2535', borderRadius: 14 }}>
            {tabs.map(tab => {
              const active = activeTab === tab.id
              const accentColor = tab.id === 'resources' ? '#00ff88' : (tab.id === 'achievements' ? '#67c7ff' : '#ffb347')
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '8px 18px', borderRadius: 11, border: 'none', cursor: 'pointer',
                    fontSize: '0.82rem', fontWeight: active ? 600 : 400,
                    background: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                    color: active ? accentColor : '#4a6070',
                    transition: 'all 0.2s',
                    boxShadow: active ? `0 0 0 1px ${accentColor}22` : 'none',
                  }}
                >
                  <tab.icon size={13} />
                  {tab.label}
                  {!loading[tab.loadKey] && (
                    <span style={{
                      padding: '1px 7px', borderRadius: 100, fontSize: '0.67rem',
                      background: active ? `${accentColor}18` : 'rgba(255,255,255,0.04)',
                      color: active ? accentColor : '#2a3a4a',
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content — same container */}
        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px clamp(20px,4vw,60px) clamp(60px,8vw,100px)', boxSizing: 'border-box' }}>

          {activeTab === 'resources' && (
            loading.posts ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 18 }}>
                {[1, 2, 3].map(i => <SkeletonCard key={i} type="blog" />)}
              </div>
            ) : posts.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
                {posts.map((post, i) => (
                  <ScrollReveal key={post.id} delay={0.06 * ((i % 4) + 1)} inline>
                    <BlogCard {...post} />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <EmptyState text="No resources published yet." />
            )
          )}

          {activeTab === 'achievements' && (
            loading.achievements ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 18 }}>
                {[1, 2, 3].map(i => <SkeletonCard key={i} type="achievement" />)}
              </div>
            ) : achievements.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 18 }}>
                {achievements.map((a, i) => (
                  <ScrollReveal key={a.id} delay={0.06 * ((i % 4) + 1)} inline>
                    <AchievementCard {...a} />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <EmptyState text="No achievements logged yet." />
            )
          )}

          {activeTab === 'projects' && (
            loading.projects ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 18 }}>
                {[1, 2, 3].map(i => <SkeletonCard key={i} type="project" />)}
              </div>
            ) : projects.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
                {projects.map((proj, i) => (
                  <ScrollReveal key={proj.id} delay={0.06 * ((i % 4) + 1)} inline>
                    <ProjectCard {...proj} />
                  </ScrollReveal>
                ))}
              </div>
            ) : (
              <EmptyState text="No projects added yet." />
            )
          )}
        </main>
      </div>
    </div>
  )
}

function EmptyState({ text }) {
  return (
    <div style={{ padding: '56px 24px', textAlign: 'center', border: '1px dashed #1a2535', borderRadius: 16, background: 'rgba(8,11,16,0.5)' }}>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#2a3a4a', margin: 0 }}>{text}</p>
    </div>
  )
}