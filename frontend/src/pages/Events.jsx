import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import ElectricBorder from '../components/ElectricBorder'
import EventCard from '../components/EventCard'
import PageBackdrop from '../components/PageBackdrop'
import ScrollReveal from '../components/ScrollReveal'
import SkeletonCard from '../components/SkeletonCard'
import { getEvents, clearEventsCache } from '../lib/api'
import { supabase } from '../lib/supabase'

function SectionTitle() {
  return (
    <ElectricBorder color="#67c7ff" speed={0.55} chaos={0.01} thickness={1.4} borderRadius={28} className="mx-auto w-full max-w-2xl rounded-[28px]">
      <div
        className="rounded-[28px] border border-white/6 px-6 py-7 text-center sm:px-8 sm:py-8"
        style={{ background: ['radial-gradient(circle at top left,rgba(103,199,255,0.12),transparent 34%)', 'radial-gradient(circle at 82% 18%,rgba(0,255,136,0.08),transparent 24%)', 'rgba(10,14,19,0.94)'].join(',') }}
      >
        <p className="font-mono text-3xl font-semibold text-white sm:text-4xl md:text-[2.8rem]">Events</p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#8d9aac] sm:text-base">
          Workshops, talks, hack nights, and club sessions for people who like building and breaking things.
        </p>
      </div>
    </ElectricBorder>
  )
}

export default function Events() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [events, setEvents]       = useState({ upcoming: [], past: [] })
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    document.title = 'Events — KP Dev Cell'
    fetchEventsWithAutoArchive()
  }, [])

  async function fetchEventsWithAutoArchive() {
    setLoading(true)
    try {
      // Step 1: Call the Supabase RPC function to auto-archive expired events.
      // This runs with SECURITY DEFINER (bypasses RLS) so it works for anon users too.
      // Run this SQL in Supabase SQL Editor first:
      //
      // CREATE OR REPLACE FUNCTION auto_archive_events()
      // RETURNS void LANGUAGE sql SECURITY DEFINER AS $$
      //   UPDATE events SET is_upcoming = false
      //   WHERE is_upcoming = true AND deadline IS NOT NULL AND deadline < NOW();
      // $$;
      const { error: rpcError } = await supabase.rpc('auto_archive_events')
      if (rpcError) console.error('Auto-archive RPC error:', rpcError)

      // Step 2: Bust cache and fetch fresh data from Supabase
      clearEventsCache()
      const { data: allEvents, error } = await getEvents()
      if (error) throw error

      // Step 3: Split into upcoming and past
      const upcoming = (allEvents || []).filter(ev => ev.is_upcoming === true)
      const past     = (allEvents || []).filter(ev => ev.is_upcoming === false)

      setEvents({ upcoming, past })
    } catch (err) {
      console.error('Events page error:', err)
    } finally {
      setLoading(false)
    }
  }

  const current = activeTab === 'upcoming' ? events.upcoming : events.past

  return (
    <div style={{ position: 'relative' }}>
      <PageBackdrop />
      <div className="page-enter" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ height: 64 }} />
        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 80px' }}>

          {/* Header */}
          <section style={{ marginBottom: 48, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ScrollReveal><SectionTitle /></ScrollReveal>
            <ScrollReveal delay={0.06}>
              <div style={{ marginTop: 36, display: 'inline-flex', gap: 4, padding: 4, background: 'rgba(11,17,24,0.92)', border: '1px solid #243347', borderRadius: 18 }}>
                {['upcoming', 'past'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '9px 24px', borderRadius: 14, fontSize: '0.85rem', fontWeight: 500,
                      border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                      background: activeTab === tab ? '#101823' : 'transparent',
                      color:      activeTab === tab ? '#67c7ff' : '#8c9aad',
                      boxShadow:  activeTab === tab ? '0 0 18px rgba(103,199,255,0.12)' : 'none',
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {!loading && (
                      <span style={{
                        marginLeft: 7, padding: '1px 7px', borderRadius: 100, fontSize: '0.68rem',
                        background: activeTab === tab ? 'rgba(103,199,255,0.12)' : 'rgba(255,255,255,0.04)',
                        color:      activeTab === tab ? '#67c7ff' : '#4a5668',
                      }}>
                        {events[tab].length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </ScrollReveal>
          </section>

          {/* Cards */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 22 }}>
              {[1, 2, 3].map(i => <SkeletonCard key={i} type="event" />)}
            </div>
          ) : current.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 22, alignItems: 'start' }}>
              {current.map((ev, i) => (
                <ScrollReveal key={ev.id} delay={0.06 * ((i % 4) + 1)} inline>
                  <EventCard {...ev} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <ScrollReveal delay={0.08}>
              <div style={{ maxWidth: 560, margin: '0 auto', padding: '56px 24px', textAlign: 'center', border: '1px dashed #1a2535', borderRadius: 20, background: 'rgba(8,11,16,0.5)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, border: '1px solid #1a2535', background: '#0b1118', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Calendar size={22} style={{ color: '#00ff88' }} />
                </div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.9rem', color: '#e8f2fb', margin: '0 0 8px' }}>
                  {activeTab === 'upcoming' ? 'No upcoming events.' : 'No past events found.'}
                </p>
                {activeTab === 'upcoming' && (
                  <p style={{ fontSize: '0.82rem', color: '#4a6070', margin: 0, lineHeight: 1.6 }}>
                    Check back soon for workshops, hackathons, and talks.
                  </p>
                )}
              </div>
            </ScrollReveal>
          )}
        </main>
      </div>
    </div>
  )
}