import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { getAchievements, addAchievement, updateAchievement, deleteAchievement } from '../lib/api'
import ImageUpload from '../components/ImageUpload'
import {
  AdminPage, AdminPanel, AdminPrimaryButton, AdminSecondaryButton,
  AdminIconButton, AdminModal, AdminTable, AdminTh, AdminTd,
  FormField, FormInput, FormTextarea,
} from './AdminUi'

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const EMPTY_A = { title: '', description: '', date: '', image_url: '' }

export default function ManageAchievements() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_A)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Achievements — KP Dev Cell Admin'
    fetch_()
  }, [])

  async function fetch_() {
    setLoading(true)
    const { data, error: fetchError } = await getAchievements()
    if (fetchError) console.error(fetchError)
    setItems(data || [])
    setLoading(false)
  }

  function openAdd() {
    setEditing(null)
    setForm(EMPTY_A)
    setError('')
    setModal(true)
  }

  function openEdit(a) {
    setEditing(a)
    setForm({
      title: a.title || '',
      description: a.description || '',
      date: a.date?.slice(0, 10) || '',
      image_url: a.image_url || '',
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
        date: form.date || null,
        image_url: form.image_url || null,
      }

      const { error: err } = editing
        ? await updateAchievement(editing.id, payload)
        : await addAchievement(payload)

      if (err) {
        setError(err.message || 'Save failed')
        return
      }

      setModal(false)
      fetch_()
    } catch (err) {
      setError(err?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this achievement?')) return
    await deleteAchievement(id)
    fetch_()
  }

  return (
    <AdminPage
      title="Achievements"
      description="Highlight awards, milestones, and recognitions the club has earned."
      action={<AdminPrimaryButton onClick={openAdd}><Plus size={16} /> Add Achievement</AdminPrimaryButton>}
    >
      <AdminPanel>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1b232d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.95rem', color: '#fff', margin: 0 }}>
            Achievement Entries
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#6b7785' }}>{items.length} total</span>
        </div>
        <AdminTable minWidth={700}>
          <thead>
            <tr>
              <AdminTh>Image</AdminTh>
              <AdminTh>Title</AdminTh>
              <AdminTh>Description</AdminTh>
              <AdminTh>Date</AdminTh>
              <AdminTh>Actions</AdminTh>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>
                  {[...Array(5)].map((__, j) => (
                    <AdminTd key={j}><div className="skeleton" style={{ height: 14, width: j === 0 ? 40 : 100, borderRadius: 4 }} /></AdminTd>
                  ))}
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center', color: '#4a5568' }}>No achievements yet.</td></tr>
            ) : items.map((a) => (
              <tr
                key={a.id}
                style={{ transition: 'background 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#0f1820')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <AdminTd>
                  {a.image_url ? (
                    <img src={a.image_url} alt={a.title} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid #1e2a38' }} onError={(e) => { e.target.style.display = 'none' }} />
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1.2rem' }}>🏆</span>
                    </div>
                  )}
                </AdminTd>
                <AdminTd style={{ color: '#fff', fontWeight: 500 }}>{a.title}</AdminTd>
                <AdminTd><div style={{ maxWidth: 300, color: '#8b95a3' }}>{a.description || '—'}</div></AdminTd>
                <AdminTd style={{ whiteSpace: 'nowrap' }}>{fmtDate(a.date)}</AdminTd>
                <AdminTd>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <AdminIconButton onClick={() => openEdit(a)} title="Edit"><Pencil size={14} /></AdminIconButton>
                    <AdminIconButton tone="danger" onClick={() => handleDelete(a.id)} title="Delete"><Trash2 size={14} /></AdminIconButton>
                  </div>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </AdminPanel>

      {modal && (
        <AdminModal title={editing ? 'Edit Achievement' : 'Add Achievement'} onClose={() => setModal(false)} maxWidth="580px">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && (
                <div style={{ padding: '10px 14px', background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 8, color: '#ff6b6b', fontSize: '0.85rem' }}>
                  ⚠ {error}
                </div>
              )}

              <FormField label="Title" required>
                <FormInput required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </FormField>

              <FormField label="Description">
                <FormTextarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </FormField>

              <FormField label="Date">
                <FormInput type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </FormField>

              {/* Image upload */}
              <ImageUpload
                bucket="projects"
                pathPrefix="achievement-images"
                currentUrl={form.image_url}
                onUpload={(url) => setForm({ ...form, image_url: url })}
                label="Achievement Image (optional)"
                maxSize={5}
                helperText="Certificate, badge, or event photo."
              />

              {/* URL fallback */}
              <FormField label="Image URL (optional fallback)">
                <FormInput
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </FormField>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
                <AdminSecondaryButton type="button" onClick={() => setModal(false)}>Cancel</AdminSecondaryButton>
                <AdminPrimaryButton type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Achievement'}
                </AdminPrimaryButton>
              </div>
            </div>
          </form>
        </AdminModal>
      )}
    </AdminPage>
  )
}