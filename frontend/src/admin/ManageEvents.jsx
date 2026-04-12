import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2, Clock, FileText } from 'lucide-react'
import { getEvents, addEvent, updateEvent, deleteEvent } from '../lib/api'
import ImageUpload from '../components/ImageUpload'
import StorageUpload from '../components/StorageUpload'
import {
  AdminPage, AdminPanel, AdminPrimaryButton, AdminSecondaryButton,
  AdminIconButton, AdminModal, AdminTable, AdminTh, AdminTd,
  AdminTabButton, FormField, FormInput, FormTextarea,
} from './AdminUi'

function fmtDateShort(d) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function toLocalDatetimeValue(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function isDeadlinePassed(deadline) {
  return deadline ? new Date(deadline) < new Date() : false
}

// Auto-archive: if deadline has passed and event is still marked upcoming,
// update it to past automatically on the server side.
async function autoArchiveIfNeeded(events, updateFn) {
  const now = new Date()
  const toArchive = events.filter(ev =>
    ev.is_upcoming &&
    ev.deadline &&
    new Date(ev.deadline) < now
  )
  if (toArchive.length === 0) return false
  await Promise.all(toArchive.map(ev => updateFn(ev.id, { is_upcoming: false })))
  return true
}

const EMPTY_E = {
  title: '', description: '', date: '', deadline: '',
  location: '', speaker: '', resources_link: '',
  banner_url: '', pdf_url: '', is_upcoming: true,
}

export default function ManageEvents() {
  const [events, setEvents] = useState({ upcoming: [], past: [] })
  const [tab, setTab] = useState('upcoming')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_E)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Events — KP Dev Cell Admin'
    fetch_()
  }, [])

  async function fetch_() {
    setLoading(true)
    const [up, past] = await Promise.all([getEvents(true), getEvents(false)])
    const upcomingList = up.data || []

    // Auto-archive events whose deadline has passed
    const archived = await autoArchiveIfNeeded(upcomingList, updateEvent)
    if (archived) {
      // Refetch after archiving
      const [up2, past2] = await Promise.all([getEvents(true), getEvents(false)])
      setEvents({ upcoming: up2.data || [], past: past2.data || [] })
    } else {
      setEvents({ upcoming: upcomingList, past: past.data || [] })
    }
    setLoading(false)
  }

  const list = tab === 'upcoming' ? events.upcoming : events.past

  function openAdd() {
    setEditing(null)
    setForm({ ...EMPTY_E, is_upcoming: tab === 'upcoming' })
    setError('')
    setModal(true)
  }

  function openEdit(ev) {
    setEditing(ev)
    setForm({
      title: ev.title || '',
      description: ev.description || '',
      date: toLocalDatetimeValue(ev.date),
      deadline: toLocalDatetimeValue(ev.deadline),
      location: ev.location || '',
      speaker: ev.speaker || '',
      resources_link: ev.resources_link || '',
      banner_url: ev.banner_url || '',
      pdf_url: ev.pdf_url || '',
      is_upcoming: ev.is_upcoming ?? true,
    })
    setError('')
    setModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        date: form.date ? new Date(form.date).toISOString() : null,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
        banner_url: form.banner_url || null,
        pdf_url: form.pdf_url || null,
        resources_link: form.resources_link || null,
        speaker: form.speaker || null,
        location: form.location || null,
      }
      const { error: err } = editing
        ? await updateEvent(editing.id, payload)
        : await addEvent(payload)
      if (err) { setError(err.message || 'Save failed'); return }
      setModal(false)
      fetch_()
    } catch (err) {
      setError(err?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this event?')) return
    await deleteEvent(id); fetch_()
  }

  return (
    <AdminPage
      title="Events"
      description="Create announcements, add deadlines, upload posters and PDFs. Events auto-archive when their deadline passes."
      action={<AdminPrimaryButton onClick={openAdd}><Plus size={16} /> Add Event</AdminPrimaryButton>}
    >
      <AdminPanel style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <AdminTabButton active={tab === 'upcoming'} onClick={() => setTab('upcoming')}>
            Upcoming ({events.upcoming.length})
          </AdminTabButton>
          <AdminTabButton active={tab === 'past'} onClick={() => setTab('past')}>
            Past ({events.past.length})
          </AdminTabButton>
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#6b7785' }}>
            {list.length} event{list.length !== 1 ? 's' : ''}
          </span>
        </div>
      </AdminPanel>

      <AdminPanel>
        <AdminTable minWidth={960}>
          <thead>
            <tr>
              <AdminTh>Event</AdminTh>
              <AdminTh>Date</AdminTh>
              <AdminTh>Deadline</AdminTh>
              <AdminTh>Location</AdminTh>
              <AdminTh>Speaker</AdminTh>
              <AdminTh>Assets</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Actions</AdminTh>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>{[...Array(8)].map((__, j) => (
                  <AdminTd key={j}><div className="skeleton" style={{ height: 14, width: 70, borderRadius: 4 }} /></AdminTd>
                ))}</tr>
              ))
            ) : list.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center', color: '#4a5568' }}>No {tab} events.</td></tr>
            ) : list.map((ev) => (
              <tr key={ev.id} style={{ transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#0f1820'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <AdminTd>
                  <div style={{ maxWidth: 200 }}>
                    <p style={{ color: '#fff', fontWeight: 500, margin: 0 }}>{ev.title}</p>
                    <p style={{ color: '#6b7785', fontSize: '0.78rem', margin: '3px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 190 }}>
                      {ev.description?.slice(0, 60) || '—'}
                    </p>
                  </div>
                </AdminTd>
                <AdminTd style={{ whiteSpace: 'nowrap' }}>{fmtDateShort(ev.date)}</AdminTd>
                <AdminTd>
                  {ev.deadline ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Clock size={11} style={{ color: isDeadlinePassed(ev.deadline) ? '#ff6b6b' : '#fbbf24', flexShrink: 0 }} />
                      <span style={{ color: isDeadlinePassed(ev.deadline) ? '#ff6b6b' : '#fbbf24', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                        {fmtDateShort(ev.deadline)}
                      </span>
                    </div>
                  ) : <span style={{ color: '#3a4450' }}>—</span>}
                </AdminTd>
                <AdminTd>{ev.location || '—'}</AdminTd>
                <AdminTd>{ev.speaker || '—'}</AdminTd>
                <AdminTd>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {ev.banner_url && <span style={{ padding: '2px 8px', borderRadius: 100, background: 'rgba(68,210,255,0.08)', color: '#44d2ff', fontSize: '0.68rem', border: '1px solid rgba(68,210,255,0.15)' }}>Banner</span>}
                    {ev.pdf_url && <span style={{ padding: '2px 8px', borderRadius: 100, background: 'rgba(87,162,255,0.08)', color: '#57a2ff', fontSize: '0.68rem', border: '1px solid rgba(87,162,255,0.15)' }}>PDF</span>}
                    {!ev.banner_url && !ev.pdf_url && <span style={{ color: '#3a4450' }}>—</span>}
                  </div>
                </AdminTd>
                <AdminTd>
                  <span style={{
                    display: 'inline-block', padding: '3px 10px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 500,
                    background: ev.is_upcoming ? 'rgba(0,255,136,0.1)' : 'rgba(68,210,255,0.1)',
                    color: ev.is_upcoming ? '#00ff88' : '#44d2ff',
                    border: `1px solid ${ev.is_upcoming ? 'rgba(0,255,136,0.2)' : 'rgba(68,210,255,0.2)'}`,
                  }}>
                    {ev.is_upcoming ? 'Upcoming' : 'Past'}
                  </span>
                </AdminTd>
                <AdminTd>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <AdminIconButton onClick={() => openEdit(ev)} title="Edit"><Pencil size={14} /></AdminIconButton>
                    <AdminIconButton tone="danger" onClick={() => handleDelete(ev.id)} title="Delete"><Trash2 size={14} /></AdminIconButton>
                  </div>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </AdminPanel>

      {modal && (
        <AdminModal title={editing ? 'Edit Event' : 'Add Event'} onClose={() => setModal(false)} maxWidth="700px">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && (
                <div style={{ padding: '10px 14px', background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 8, color: '#ff6b6b', fontSize: '0.85rem' }}>
                  ⚠ {error}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="Title" required>
                  <FormInput required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </FormField>
                <FormField label="Speaker">
                  <FormInput value={form.speaker} onChange={e => setForm({ ...form, speaker: e.target.value })} />
                </FormField>
              </div>

              <FormField label="Description">
                <FormTextarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="Event Date & Time">
                  <FormInput type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </FormField>
                <FormField label="Registration Deadline">
                  <FormInput type="datetime-local" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
                </FormField>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="Location">
                  <FormInput value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Room / Online" />
                </FormField>
                <FormField label="Resources Link (external)">
                  <FormInput type="url" value={form.resources_link} onChange={e => setForm({ ...form, resources_link: e.target.value })} placeholder="https://..." />
                </FormField>
              </div>

              {/* Banner image */}
              <ImageUpload
                bucket="banners"
                currentUrl={form.banner_url}
                onUpload={url => setForm({ ...form, banner_url: url })}
                label="Banner / Poster Image"
                maxSize={10}
                helperText="Recommended: 1200×630px. Or paste URL below."
              />
              <FormField label="Banner URL (fallback)">
                <FormInput type="url" value={form.banner_url} onChange={e => setForm({ ...form, banner_url: e.target.value })} placeholder="https://..." />
              </FormField>

              {/* PDF upload — new addition */}
              <div style={{ padding: '14px 16px', background: '#0f1820', border: '1px solid #1b2a3d', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                  <FileText size={14} style={{ color: '#57a2ff' }} />
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#8a9aaa', fontWeight: 500 }}>
                    Event PDF / Instructions / Brochure
                  </p>
                </div>
                <StorageUpload
                  bucket="projects"
                  pathPrefix="event-pdfs"
                  currentUrl={form.pdf_url}
                  onUpload={url => setForm({ ...form, pdf_url: url })}
                  label=""
                  accept="application/pdf,.pdf"
                  fileTypeLabel="PDF"
                  maxSize={20}
                  helperText="Upload event instructions, rulebook, or brochure as PDF."
                />
                <div style={{ marginTop: 10 }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#4a5568', marginBottom: 5 }}>
                    Or paste external PDF URL
                  </label>
                  <FormInput
                    type="url"
                    value={form.pdf_url}
                    onChange={e => setForm({ ...form, pdf_url: e.target.value })}
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>

              {/* Upcoming toggle */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#10161e', border: '1px solid #1e2a38', borderRadius: 12, cursor: 'pointer' }}
                onClick={() => setForm({ ...form, is_upcoming: !form.is_upcoming })}
              >
                <div style={{ width: 40, height: 22, borderRadius: 11, background: form.is_upcoming ? '#00ff88' : '#1e2a38', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
                  <div style={{ position: 'absolute', top: 2, left: form.is_upcoming ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: form.is_upcoming ? '#000' : '#4a5568', transition: 'left 0.2s' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#fff', margin: 0 }}>Upcoming event</p>
                  <p style={{ fontSize: '0.72rem', color: '#6b7785', margin: 0 }}>
                    Auto-archives when deadline passes. Disable manually to archive now.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
                <AdminSecondaryButton type="button" onClick={() => setModal(false)}>Cancel</AdminSecondaryButton>
                <AdminPrimaryButton type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Event'}
                </AdminPrimaryButton>
              </div>
            </div>
          </form>
        </AdminModal>
      )}
    </AdminPage>
  )
}