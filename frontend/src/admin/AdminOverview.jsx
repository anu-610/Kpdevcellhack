import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  FolderOpen,
  Plus,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react'
import { getStats, getUpcomingEventsCount } from '../lib/api'
import { AdminPage, AdminPanel } from './AdminUi'

const quickActions = [
  {
    label: 'Add Event',
    helper: 'Create a new workshop, talk, or hack night entry.',
    path: '/admin/events',
    icon: Calendar,
  },
  {
    label: 'Add Member',
    helper: 'Keep the public team directory current.',
    path: '/admin/team',
    icon: Users,
  },
  {
    label: 'Publish Resource',
    helper: 'Share notes, writeups, and learning material.',
    path: '/admin/resources',
    icon: BookOpen,
  },
]

export default function AdminOverview() {
  const [stats, setStats] = useState({
    members: 0,
    events: 0,
    posts: 0,
    achievements: 0,
    projects: 0,
    upcomingEvents: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Admin Overview — KP Dev Cell'

    const fetchStats = async () => {
      const [statsRes, upcomingRes] = await Promise.all([
        getStats(),
        getUpcomingEventsCount(),
      ])

      if (statsRes.data) {
        setStats({
          ...statsRes.data,
          upcomingEvents: upcomingRes.count || 0,
        })
      }

      setLoading(false)
    }

    fetchStats()
  }, [])

  const upcomingEventShare = useMemo(() => {
    if (!stats.events) return null
    return Math.round((stats.upcomingEvents / stats.events) * 100)
  }, [stats.events, stats.upcomingEvents])

  const showcaseEntries = stats.posts + stats.achievements + stats.projects

  const statCards = [
    {
      label: 'Team Members',
      value: stats.members,
      icon: Users,
      accent: 'text-[#00ff88]',
      helper: 'Active roster visible on the public site',
    },
    {
      label: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: Calendar,
      accent: 'text-[#44d2ff]',
      helper: upcomingEventShare !== null
        ? `${upcomingEventShare}% of all events are currently upcoming`
        : 'Waiting for event data',
      trend: upcomingEventShare !== null ? 'derived' : null,
    },
    {
      label: 'All Events',
      value: stats.events,
      icon: Calendar,
      accent: 'text-[#7ed7ff]',
      helper: stats.upcomingEvents > 0
        ? `${stats.upcomingEvents} event${stats.upcomingEvents === 1 ? '' : 's'} live right now`
        : 'Event archive ready for new sessions',
      trend: stats.upcomingEvents > 0 ? 'derived' : null,
    },
    {
      label: 'Resources',
      value: stats.posts,
      icon: BookOpen,
      accent: 'text-[#57a2ff]',
      helper: showcaseEntries > 0
        ? `${Math.round((stats.posts / showcaseEntries) * 100) || 0}% of showcase content is resource-focused`
        : 'No published resources yet',
      trend: showcaseEntries > 0 ? 'derived' : null,
    },
    {
      label: 'Achievements',
      value: stats.achievements,
      icon: Trophy,
      accent: 'text-[#fbbf24]',
      helper: stats.achievements > 0 ? 'Milestones and recognitions are tracked here' : 'No achievements logged yet',
    },
    {
      label: 'Projects',
      value: stats.projects,
      icon: FolderOpen,
      accent: 'text-[#ff8a65]',
      helper: stats.projects > 0 ? 'Portfolio entries are ready for visitors' : 'Add projects to populate the portfolio',
    },
  ]

  const sections = [
    {
      title: 'Team',
      description: 'Manage coordinators, mentors, and active members.',
      icon: Users,
      color: 'text-[#00ff88]',
      path: '/admin/team',
    },
    {
      title: 'Events',
      description: 'Update upcoming sessions, deadlines, and poster details.',
      icon: Calendar,
      color: 'text-[#44d2ff]',
      path: '/admin/events',
    },
    {
      title: 'Resources',
      description: 'Publish notes, attach PDFs, and maintain drafts cleanly.',
      icon: BookOpen,
      color: 'text-[#57a2ff]',
      path: '/admin/resources',
    },
    {
      title: 'Achievements',
      description: 'Highlight wins, recognitions, and club milestones.',
      icon: Trophy,
      color: 'text-[#fbbf24]',
      path: '/admin/achievements',
    },
  ]

  return (
    <AdminPage
      title="Overview"
      description="A cleaner admin workspace for keeping KP Dev Cell updated without the dashboard getting in your way."
      action={
        <Link
          to="/admin/events"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00ff88] px-4 py-2.5 text-sm font-medium text-black shadow-[0_8px_24px_rgba(0,255,136,0.18)] transition-all hover:bg-[#00e37a] hover:shadow-[0_12px_28px_rgba(0,255,136,0.24)]"
        >
          <Plus size={16} />
          Add Event
        </Link>
      }
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat) => (
          <AdminPanel key={stat.label} className="min-w-0 p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className={`inline-flex rounded-2xl border border-[#1f2937] bg-[#131922] p-3 ${stat.accent}`}>
                <stat.icon size={20} />
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-[#1a2f24] bg-[#0f1713] px-3 py-1 text-[0.72rem] text-[#8da39a]">
                <span className="live-dot h-2.5 w-2.5 rounded-full bg-[#00ff88]" />
                Real time
              </div>
            </div>

            <div className="font-mono text-[2rem] font-semibold leading-none text-white">
              {loading ? (
                <div className="skeleton h-9 w-16" />
              ) : (
                stat.value
              )}
            </div>

            <p className="mt-3 text-base font-medium text-white">{stat.label}</p>

            <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-[#8994a2]">
              {stat.trend && !loading ? (
                <TrendingUp size={16} className="mt-1 shrink-0 text-[#00ff88]" />
              ) : (
                <Sparkles size={16} className="mt-1 shrink-0 text-[#5f6a78]" />
              )}
              <span>{stat.helper}</span>
            </div>
          </AdminPanel>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)]">
        <AdminPanel className="p-6">
          <div className="mb-5">
            <h2 className="font-mono text-[1.25rem] font-semibold text-white">Sections</h2>
            <p className="mt-2 text-sm leading-6 text-[#7d8795]">
              Core admin areas are grouped in a clean 2x2 grid for quicker navigation.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {sections.map((section) => (
              <Link
                key={section.title}
                to={section.path}
                className="group rounded-[24px] border border-[#1d2633] bg-[#10161e] p-5 transition-all hover:border-[#35506a] hover:bg-[#121a24]"
              >
                <div className={`mb-4 inline-flex rounded-2xl border border-[#202936] bg-[#141b25] p-3 ${section.color}`}>
                  <section.icon size={20} />
                </div>

                <h3 className="text-base font-medium text-white">{section.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#7f8997]">{section.description}</p>

                <span className="mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-[#aab4c0] transition-colors group-hover:bg-[#16202b] group-hover:text-white">
                  Open section
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </AdminPanel>

        <div className="grid gap-5">
          <AdminPanel className="p-6">
            <h2 className="font-mono text-[1.25rem] font-semibold text-white">Quick Actions</h2>
            <p className="mt-2 text-sm leading-6 text-[#7d8795]">
              Common actions stay close so routine updates take fewer clicks.
            </p>

            <div className="mt-6 space-y-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className="group flex items-center justify-between gap-3 rounded-[20px] border border-[#253041] bg-[#10161e] px-5 py-4 text-left transition-all hover:border-[#39506a] hover:bg-[#141d28]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#263142] bg-[#141c26] text-[#9bb5cc] transition-colors group-hover:text-white">
                      <action.icon size={18} />
                    </div>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-white">{action.label}</span>
                      <span className="mt-1 block text-xs text-[#7b8594]">{action.helper}</span>
                    </span>
                  </div>
                  <ArrowRight size={16} className="shrink-0 text-[#aab4c0] transition-transform group-hover:translate-x-1 group-hover:text-white" />
                </Link>
              ))}
            </div>
          </AdminPanel>

          <AdminPanel className="p-6">
            <Link
              to="/admin/projects"
              className="group flex items-center justify-between gap-4 rounded-[22px] border border-[#253041] bg-[#10161e] px-5 py-5 transition-all hover:border-[#3f5368] hover:bg-[#141d28]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#263142] bg-[#141c26] text-[#ff8a65]">
                  <FolderOpen size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Projects Workspace</p>
                  <p className="mt-1 text-xs text-[#7b8594]">Open the project manager for portfolio updates.</p>
                </div>
              </div>
              <ArrowRight size={16} className="shrink-0 text-[#aab4c0] transition-transform group-hover:translate-x-1 group-hover:text-white" />
            </Link>
          </AdminPanel>
        </div>
      </div>
    </AdminPage>
  )
}
