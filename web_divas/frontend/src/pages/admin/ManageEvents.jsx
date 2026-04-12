import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'

const EMPTY = { name: '', type: 'session', date: '', venue: '', description: '' }

export default function ManageEvents() {
  const api = useApi()
  const [events, setEvents]   = useState([])
  const [form, setForm]       = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [msg, setMsg]         = useState(null)

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3000) }
  const fetch = () => {
    setLoading(true)
    api.get('/events/').then(r => setEvents(r.data)).catch(() => flash('err', 'fetch failed.')).finally(() => setLoading(false))
  }
  useEffect(fetch, [])

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleAdd = async () => {
    if (!form.name.trim()) { flash('err', 'name required.'); return }
    setSaving(true)
    try { await api.post('/events/', form); setForm(EMPTY); fetch(); flash('ok', 'event created.') }
    catch (e) {
           const detail = e.response?.data?.detail
           flash('err', typeof detail === 'string' ? detail : 'failed.')}
    finally { setSaving(false) }
  }
  const handleDelete = async (id) => {
    if (!confirm('delete this event?')) return
    try { await api.delete(`/events${id}`); fetch() }
    catch { flash('err', 'delete failed.') }
  }

  return (
    <div style={{ padding: '64px 0 80px' }}>
      <div className="container">
        <Link to="/admin" style={s.back}>← dashboard</Link>
        <div style={s.label}>// admin · events</div>
        <h1 style={s.title}>MANAGE EVENTS</h1>
        <div className="divider" />

        <div style={s.section}>
          <div style={s.sectionHeader}>$ create_event</div>
          <div style={s.formGrid}>
            <input name="name"  value={form.name}  onChange={handleChange} placeholder="event name *" style={s.input} />
            <input name="venue" value={form.venue} onChange={handleChange} placeholder="venue" style={s.input} />
            <select name="type" value={form.type} onChange={handleChange} style={s.input}>
              {['hackathon','session','workshop','talk','collab','other'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="date" name="date" value={form.date} onChange={handleChange} style={s.input} />
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="description..." rows={2} style={{ ...s.input, gridColumn: '1 / -1', resize: 'vertical' }} />
          </div>
          {msg && <div style={{ ...s.msg, ...(msg.type === 'ok' ? s.msgOk : s.msgErr) }}>{msg.text}</div>}
          <button onClick={handleAdd} disabled={saving} className="btn btn-primary" style={{ margin: '0 20px 20px' }}>
            {saving ? <><span className="blink">█</span> saving...</> : '$ create_event'}
          </button>
        </div>

        <div style={s.listHeader}>all events ({events.length})</div>
        {loading
          ? <div style={s.state}><span className="blink" style={{ color: 'var(--accent)' }}>█</span> loading...</div>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {events.map(e => (
                <div key={e._id} className="card" style={s.row}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 600 }}>{e.name}</span>
                    <span className="badge badge-blue" style={{ fontSize: 10 }}>{e.type}</span>
                    {e.date && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)' }}>{new Date(e.date).toLocaleDateString()}</span>}
                  </div>
                  <button onClick={() => handleDelete(e._id)} className="btn" style={{ fontSize: 12, padding: '5px 14px', color: 'var(--danger)', borderColor: 'rgba(248,113,113,0.25)' }}>delete</button>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}

const s = {
  back:  { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', textDecoration: 'none', display: 'block', marginBottom: 24 },
  label: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', letterSpacing: '1px', marginBottom: 16 },
  title: { fontFamily: 'var(--font-pixel)', fontSize: 'clamp(0.9rem, 3vw, 1.6rem)', marginBottom: 12 },
  section: { background: 'var(--bg-card)', border: '1px solid var(--border-dim)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 32 },
  sectionHeader: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--accent)', background: 'var(--bg-elevated)', padding: '12px 20px', borderBottom: '1px solid var(--border-dim)' },
  formGrid: { padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 },
  input: { fontFamily: 'var(--font-mono)', fontSize: 13, padding: '10px 12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-mid)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', outline: 'none', width: '100%' },
  msg:    { fontFamily: 'var(--font-mono)', fontSize: 12, padding: '10px 20px', margin: '0 20px 8px' },
  msgOk:  { color: 'var(--accent)',  background: 'var(--accent-dim)',  borderRadius: 'var(--radius-md)' },
  msgErr: { color: 'var(--danger)',  background: 'rgba(248,113,113,0.08)', borderRadius: 'var(--radius-md)' },
  listHeader: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-dim)', letterSpacing: '1px', marginBottom: 12 },
  state: { fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-dim)', padding: '20px 0' },
  row:   { padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
}
