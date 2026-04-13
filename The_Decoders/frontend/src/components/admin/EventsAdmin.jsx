import { useState, useEffect } from 'react'
import { auth } from '../../firebase.js'
import api from '../../api.js'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const emptyForm = {
  title: '',
  description: '',
  date: '',
  image_url: ''
}

const parseLocalDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

const getLocalDateKey = (dateValue) => {
  if (typeof dateValue === 'string' && dateValue.length >= 10) {
    return dateValue.slice(0, 10)
  }
  const date = new Date(dateValue)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getEventTypeFromDate = (dateValue) => {
  const eventDay = getLocalDateKey(dateValue)
  const todayDay = getLocalDateKey(new Date())
  if (eventDay === todayDay) return 'today'
  return eventDay > todayDay ? 'upcoming' : 'past'
}

/* ── Shared input style (mirrors MembersAdmin) ── */
const inputStyle = {
  backgroundColor: 'rgba(13,17,23,0.8)',
  border: '1px solid rgba(35,43,58,0.95)',
  borderRadius: 8,
  padding: '9px 12px',
  color: '#e2e8f0',
  fontSize: 13,
  fontFamily: '"Fira Code", "Cascadia Code", monospace',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

/* ── Terminal-style labeled input ── */
function TermInput({ label, name, value, onChange, type = 'text', required, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{
        fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: focused ? '#14B8A6' : '#4B5563',
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        transition: 'color 0.2s',
      }}>
        <span style={{ color: '#374151' }}>const </span>
        <span style={{ color: focused ? '#14B8A6' : '#9CA3AF' }}>{label}</span>
        <span style={{ color: '#374151' }}> =</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputStyle,
          borderColor: focused ? '#14B8A6' : 'rgba(35,43,58,0.95)',
          boxShadow: focused ? '0 0 14px rgba(20,184,166,0.18)' : 'none',
        }}
      />
    </div>
  )
}

/* ── Type badge ── */
function TypeBadge({ type }) {
  const map = {
    upcoming: { color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)', label: 'upcoming' },
    today:    { color: '#FFBD2E', bg: 'rgba(255,189,46,0.08)',  border: 'rgba(255,189,46,0.2)',  label: 'today'    },
    past:     { color: '#4B5563', bg: 'rgba(75,85,99,0.08)',    border: 'rgba(75,85,99,0.2)',    label: 'past'     },
  }
  const s = map[type] || map.past
  return (
    <span style={{
      fontSize: 10, color: s.color,
      backgroundColor: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 20, padding: '2px 8px',
      fontFamily: '"Fira Code", "Cascadia Code", monospace',
      letterSpacing: '0.08em',
    }}>
      {s.label}
    </span>
  )
}

/* ── Event row in the file tree sidebar ── */
function EventTreeItem({ event, isSelected, onSelect, onEdit, onDelete, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const typeColor = event.type === 'upcoming' ? '#4ade80' : event.type === 'today' ? '#FFBD2E' : '#374151'

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
    >
      <div
        onClick={() => onSelect(event)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 12px',
          backgroundColor: isSelected
            ? 'rgba(20,184,166,0.1)'
            : hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
          borderLeft: isSelected ? '2px solid #14B8A6' : '2px solid transparent',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {/* Date chip */}
        <div style={{
          width: 22, height: 22, borderRadius: 5, flexShrink: 0,
          backgroundColor: 'rgba(20,184,166,0.08)',
          border: `1px solid ${typeColor}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, color: typeColor, fontWeight: 700,
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
        }}>
          {event.date ? new Date(event.date).getDate() : '?'}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 12, color: isSelected ? '#e2e8f0' : '#9CA3AF',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
          }}>
            {event.title}
          </div>
          <div style={{
            fontSize: 10, color: typeColor,
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
          }}>
            {event.type}
          </div>
        </div>

        {(hovered || isMobile) && (
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(m => !m) }}
            style={{
              background: 'none', border: 'none', color: '#6B7280',
              cursor: 'pointer', padding: '0 2px', fontSize: 14,
              flexShrink: 0, lineHeight: 1,
            }}
          >
            ⋯
          </button>
        )}
      </div>

      {/* Context dropdown */}
      {menuOpen && (
        <div style={{
          position: 'absolute', right: 8, top: '100%', zIndex: 200,
          backgroundColor: '#161b22',
          border: '1px solid rgba(20,184,166,0.2)',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          minWidth: 140,
        }}>
          <button
            onClick={() => { onEdit(event); setMenuOpen(false) }}
            style={{
              display: 'block', width: '100%', padding: '9px 14px',
              background: 'none', border: 'none',
              color: '#9CA3AF', fontSize: 12, textAlign: 'left',
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.target.style.backgroundColor = 'rgba(20,184,166,0.08)'; e.target.style.color = '#14B8A6' }}
            onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#9CA3AF' }}
          >
            $ edit event
          </button>
          <button
            onClick={() => { onDelete(event._id); setMenuOpen(false) }}
            style={{
              display: 'block', width: '100%', padding: '9px 14px',
              background: 'none', border: 'none',
              color: '#6B7280', fontSize: 12, textAlign: 'left',
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
              cursor: 'pointer',
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
            onMouseEnter={e => { e.target.style.backgroundColor = 'rgba(239,68,68,0.08)'; e.target.style.color = '#ef4444' }}
            onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#6B7280' }}
          >
            $ rm event
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Event detail panel ── */
function EventDetail({ event, isMobile }) {
  if (!event) return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: '#374151', fontFamily: '"Fira Code", "Cascadia Code", monospace',
    }}>
      <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>📅</div>
      <div style={{ fontSize: 13 }}>select an event to preview</div>
      <div style={{ fontSize: 11, marginTop: 4, color: '#1f2937' }}>event_info — bash</div>
    </div>
  )

  const dateStr = event.date
    ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'null'

  const fields = [
    { key: 'title',       val: event.title },
    { key: 'date',        val: dateStr },
    { key: 'type',        val: event.type },
    { key: 'description', val: event.description || 'null' },
    { key: 'image_url',   val: event.image_url || 'null' },
  ]

  const typeColor = event.type === 'upcoming' ? '#4ade80' : event.type === 'today' ? '#FFBD2E' : '#4B5563'

  return (
    <div style={{ flex: 1, overflow: 'auto', fontFamily: '"Fira Code", "Cascadia Code", monospace' }}>
      {/* Terminal title bar */}
      <div style={{
        padding: '10px 16px',
        backgroundColor: 'rgba(13,17,23,0.6)',
        borderBottom: '1px solid rgba(20,184,166,0.1)',
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 12, color: '#4B5563',
      }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5F57', '#FFBD2E', '#28CA41'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c, opacity: 0.7 }} />
          ))}
        </div>
        <span style={{ marginLeft: 6 }}>event_info — bash</span>
      </div>

      <div style={{ padding: isMobile ? '16px 12px' : '20px 20px' }}>
        {/* Image preview + header */}
        {event.image_url && (
          <div style={{ marginBottom: 20, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(20,184,166,0.15)' }}>
            <img
              src={event.image_url}
              alt={event.title}
              style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
              onError={e => { e.target.parentElement.style.display = 'none' }}
            />
          </div>
        )}

        {/* Title + type header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 8, flexShrink: 0,
            backgroundColor: 'rgba(20,184,166,0.08)',
            border: `2px solid ${typeColor}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>
            📅
          </div>
          <div>
            <div style={{ color: '#e2e8f0', fontSize: 15, fontWeight: 600 }}>{event.title}</div>
            <div style={{ marginTop: 4 }}>
              <TypeBadge type={event.type} />
            </div>
          </div>
        </div>

        {/* cat event.json */}
        <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 10 }}>
          <span style={{ color: '#14B8A6' }}>$ </span>cat event.json
        </div>

        <div style={{
          backgroundColor: 'rgba(13,17,23,0.7)',
          border: '1px solid rgba(35,43,58,0.9)',
          borderRadius: 10, padding: '16px 18px',
          fontSize: 13, lineHeight: 2,
        }}>
          <div style={{ color: '#6B7280' }}>{'{'}</div>
          {fields.map(({ key, val }) => (
            <div key={key} style={{ paddingLeft: 16 }}>
              <span style={{ color: '#14B8A6' }}>"{key}"</span>
              <span style={{ color: '#6B7280' }}>: </span>
              <span style={{ color: key === 'type' ? typeColor : '#e2e8f0' }}>"{val}"</span>
              <span style={{ color: '#6B7280' }}>,</span>
            </div>
          ))}
          <div style={{ color: '#6B7280' }}>{'}'}</div>
        </div>

        {/* Prompt */}
        <div style={{ marginTop: 16, fontSize: 13, color: '#6B7280' }}>
          <span style={{ color: '#14B8A6' }}>$ </span>
          <span style={{ borderBottom: '1px solid #374151' }}>_</span>
        </div>
      </div>
    </div>
  )
}

/* ── Main component ── */
function EventsAdmin() {
  const [events, setEvents]       = useState([])
  const [form, setForm]           = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading]     = useState(false)
  const [selected, setSelected]   = useState(null)
  const [view, setView]           = useState('form') // 'form' | 'preview'
  const [isMobile, setIsMobile]   = useState(() => window.innerWidth <= 900)
  const [treeOpen, setTreeOpen]   = useState(true)

  useEffect(() => { fetchEvents() }, [])

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 900
      setIsMobile(mobile)
      if (!mobile) setTreeOpen(true)
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events')
      setEvents(res.data.map(event => ({
        ...event,
        type: getEventTypeFromDate(event.date),
      })))
    } catch (err) {
      toast.error('Failed to fetch events')
    }
  }

  const getToken = async () => {
    const token = await auth.currentUser.getIdToken()
    return { headers: { Authorization: `Bearer ${token}` } }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const eventDate = parseLocalDate(form.date)
      eventDate.setHours(0, 0, 0, 0)
      const autoType =
        eventDate.getTime() === today.getTime() ? 'today'
        : eventDate > today ? 'upcoming' : 'past'

      const payload = { ...form, type: autoType }
      const config = await getToken()
      if (editingId) {
        await api.put(`/events/${editingId}`, payload, config)
        toast.success('Event updated')
      } else {
        await api.post('/events', payload, config)
        toast.success('Event added')
      }
      setForm(emptyForm)
      setEditingId(null)
      fetchEvents()
    } catch (err) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      type: event.type,
      image_url: event.image_url
    })
    setEditingId(event._id)
    setView('form')
  }

  const handleDelete = async (id) => {
    if (!confirm('rm -rf event? This cannot be undone.')) return
    try {
      const config = await getToken()
      await api.delete(`/events/${id}`, config)
      toast.success('Event removed')
      if (selected?._id === id) setSelected(null)
      fetchEvents()
    } catch (err) {
      toast.error('Failed to delete')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSelect = (event) => {
    setSelected(event)
    setView('preview')
    if (isMobile) setTreeOpen(false)
  }

  // Group events by type for folder display
  const upcoming = events.filter(e => e.type === 'upcoming')
  const today    = events.filter(e => e.type === 'today')
  const past     = events.filter(e => e.type === 'past')

  return (
    <>
      <style>{`
        .events-admin-input:hover {
          border-color: rgba(20,184,166,0.35) !important;
          box-shadow: 0 0 8px rgba(20,184,166,0.1) !important;
        }
        .term-btn-primary {
          background: linear-gradient(135deg, rgba(20,184,166,0.9), rgba(20,184,166,0.7));
          border: none; border-radius: 8px;
          color: #0D1117; font-family: "Fira Code","Cascadia Code",monospace;
          font-size: 12px; font-weight: 700; letter-spacing: 0.08em;
          padding: 10px 20px; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .term-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 0 20px rgba(20,184,166,0.35); }
        .term-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
        .term-btn-ghost {
          background: none;
          border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
          color: #6B7280; font-family: "Fira Code","Cascadia Code",monospace;
          font-size: 12px; padding: 10px 20px; cursor: pointer;
          transition: all 0.15s;
        }
        .term-btn-ghost:hover { border-color: rgba(255,255,255,0.2); color: #9CA3AF; }

        .dp-input {
  background-color: rgba(13,17,23,0.8);
  border: 1px solid rgba(35,43,58,0.95);
  border-radius: 8px;
  padding: 9px 12px;
  color: #e2e8f0;
  font-size: 13px;
  font-family: "Fira Code", "Cascadia Code", monospace;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}
.dp-calendar {
  background-color: #0D1117 !important;
  border: 1px solid rgba(20,184,166,0.25) !important;
  font-family: "Fira Code", "Cascadia Code", monospace !important;
  border-radius: 10px !important;
}
.react-datepicker__header {
  background-color: rgba(20,184,166,0.08) !important;
  border-bottom: 1px solid rgba(20,184,166,0.15) !important;
  color: #e2e8f0 !important;
}
.react-datepicker__current-month,
.react-datepicker__day-name {
  color: #14B8A6 !important;
}
.react-datepicker__day {
  color: #9CA3AF !important;
}
.react-datepicker__day:hover {
  background-color: rgba(20,184,166,0.15) !important;
  color: #e2e8f0 !important;
  border-radius: 6px !important;
}
.react-datepicker__day--selected {
  background-color: #14B8A6 !important;
  color: #0D1117 !important;
  border-radius: 6px !important;
}
.react-datepicker__day--today {
  color: #FFBD2E !important;
  font-weight: bold !important;
}
.react-datepicker__navigation-icon::before {
  border-color: #14B8A6 !important;
}
      `}</style>

      {/* ── IDE-style 2-panel layout (mirrors MembersAdmin) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '240px 1fr',
        gridTemplateRows: isMobile ? 'auto auto auto 1fr' : 'auto 1fr',
        gap: 0,
        minHeight: 'calc(100vh - 180px)',
        border: '1px solid rgba(20,184,166,0.12)',
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: 'rgba(13,17,23,0.6)',
        backdropFilter: 'blur(10px)',
      }}>

        {/* ── Left: file tree of events ── */}
        <div style={{
          gridRow: isMobile ? 'auto' : '1 / 3',
          borderRight: '1px solid rgba(20,184,166,0.1)',
          display: 'flex', flexDirection: 'column',
          backgroundColor: 'rgba(10,13,18,0.5)',
          borderBottom: isMobile ? '1px solid rgba(20,184,166,0.1)' : 'none',
        }}>
          {/* Tree header */}
          <div style={{
            padding: '12px 14px',
            borderBottom: '1px solid rgba(20,184,166,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{
              fontSize: 10, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#374151',
              fontFamily: '"Fira Code", "Cascadia Code", monospace',
            }}>
              EVENTS ({events.length})
            </span>
            <button
              onClick={() => { setView('form'); setEditingId(null); setForm(emptyForm) }}
              style={{
                background: 'rgba(20,184,166,0.1)',
                border: '1px solid rgba(20,184,166,0.25)',
                borderRadius: 5, color: '#14B8A6',
                fontSize: 16, lineHeight: 1, padding: '1px 7px',
                cursor: 'pointer', fontWeight: 300,
              }}
              title="Add new event"
            >
              +
            </button>
          </div>

          {isMobile && (
            <button
              onClick={() => setTreeOpen(v => !v)}
              style={{
                margin: '10px 12px 8px',
                background: 'rgba(20,184,166,0.08)',
                border: '1px solid rgba(20,184,166,0.2)',
                borderRadius: 8,
                color: '#14B8A6',
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                fontSize: 12,
                padding: '8px 10px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              {treeOpen ? '$ hide event explorer' : '$ show event explorer'}
            </button>
          )}

          {/* Grouped folder tree */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: 12,
            maxHeight: isMobile ? 260 : 'none',
            display: !isMobile || treeOpen ? 'block' : 'none',
          }}>
            {events.length === 0 ? (
              <div style={{
                padding: '20px 14px', fontSize: 11,
                color: '#374151', fontFamily: '"Fira Code", "Cascadia Code", monospace',
                textAlign: 'center',
              }}>
                no events yet
              </div>
            ) : (
              <>
                {[
                  { label: '📅 upcoming/', items: upcoming, color: '#4ade80' },
                  { label: '⚡ today/',    items: today,    color: '#FFBD2E' },
                  { label: '📂 past/',     items: past,     color: '#374151' },
                ].map(group => group.items.length > 0 && (
                  <div key={group.label}>
                    <div style={{
                      padding: '8px 12px', fontSize: 11,
                      color: group.color, fontFamily: '"Fira Code", "Cascadia Code", monospace',
                      display: 'flex', alignItems: 'center', gap: 6,
                      opacity: 0.7,
                    }}>
                      <span>▾</span>
                      <span>{group.label}</span>
                    </div>
                    {group.items.map(ev => (
                      <EventTreeItem
                        key={ev._id}
                        event={ev}
                        isSelected={selected?._id === ev._id && view === 'preview'}
                        onSelect={handleSelect}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isMobile={isMobile}
                      />
                    ))}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ── Top-right: view toggle tabs ── */}
        <div style={{
          borderBottom: '1px solid rgba(20,184,166,0.1)',
          display: 'flex', alignItems: 'flex-end',
          backgroundColor: 'rgba(10,13,18,0.4)',
          padding: '0 4px',
          overflowX: 'auto',
        }}>
          {[
            { id: 'form',    label: editingId ? '✏️ edit_event.js' : '➕ new_event.js' },
            { id: 'preview', label: `👁 preview${selected ? ` — ${selected.title}` : ''}` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              style={{
                padding: '8px 16px',
                background: view === tab.id ? 'rgba(22,27,38,0.9)' : 'transparent',
                border: 'none',
                borderTop: view === tab.id ? '1px solid #14B8A6' : '1px solid transparent',
                color: view === tab.id ? '#e2e8f0' : '#4B5563',
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                fontSize: 12, cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Bottom-right: form or preview ── */}
        <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {view === 'form' ? (
            <div style={{ padding: isMobile ? '16px 12px' : '24px 28px' }}>
              {/* Form header comment */}
              <div style={{
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                fontSize: 12, color: '#374151',
                marginBottom: 20, lineHeight: 1.8,
              }}>
                <div>{'// ' + (editingId ? 'editing existing event record' : 'adding new event to db')}</div>
                <div>{'// date determines type automatically (past/today/upcoming)'}</div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Fields grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 16, marginBottom: 16,
                }}>
                  <TermInput
                    label="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder='"Hackathon 2025"'
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
  <label style={{
    fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
    color: '#4B5563', fontFamily: '"Fira Code", "Cascadia Code", monospace',
  }}>
    <span style={{ color: '#374151' }}>const </span>
    <span style={{ color: '#9CA3AF' }}>date</span>
    <span style={{ color: '#374151' }}> =</span>
  </label>
  <DatePicker
    selected={form.date ? new Date(form.date) : null}
    onChange={(date) => {
      const val = date ? `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}` : ''
      setForm(prev => ({ ...prev, date: val }))
    }}
    dateFormat="yyyy-MM-dd"
    placeholderText="pick a date"
    className="dp-input"
    calendarClassName="dp-calendar"
  />
</div>
                  <TermInput
                    label="image_url"
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    placeholder='"https://..."'
                  />
                </div>

                {/* Description full width */}
                <div style={{ marginBottom: 22 }}>
                  <label style={{
                    display: 'block', marginBottom: 5,
                    fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: '#4B5563', fontFamily: '"Fira Code", "Cascadia Code", monospace',
                  }}>
                    <span style={{ color: '#374151' }}>const </span>
                    <span style={{ color: '#9CA3AF' }}>description</span>
                    <span style={{ color: '#374151' }}> =</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder='"Describe the event..."'
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      lineHeight: 1.6,
                    }}
                  />
                </div>

                {/* Auto-type indicator */}
                {form.date && (
                  <div style={{
                    marginBottom: 20,
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    backgroundColor: 'rgba(20,184,166,0.05)',
                    border: '1px solid rgba(20,184,166,0.12)',
                    borderRadius: 8, padding: '8px 14px',
                    fontFamily: '"Fira Code", "Cascadia Code", monospace',
                    fontSize: 12, color: '#6B7280',
                  }}>
                    <span style={{ color: '#374151' }}>type</span>
                    <span style={{ color: '#6B7280' }}> = </span>
                    {(() => {
                      const t = getEventTypeFromDate(form.date)
                      const c = t === 'upcoming' ? '#4ade80' : t === 'today' ? '#FFBD2E' : '#4B5563'
                      return <span style={{ color: c }}>"{t}"</span>
                    })()}
                    <span style={{ color: '#374151', fontSize: 10 }}>// auto-computed</span>
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button type="submit" disabled={loading} className="term-btn-primary">
                    {loading ? '$ executing...' : editingId ? '$ git commit -m "update"' : '$ git add event'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="term-btn-ghost"
                      onClick={() => { setForm(emptyForm); setEditingId(null) }}
                    >
                      $ cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <EventDetail event={selected} isMobile={isMobile} />
          )}
        </div>
      </div>
    </>
  )
}

export default EventsAdmin