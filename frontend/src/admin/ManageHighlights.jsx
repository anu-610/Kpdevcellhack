import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Images } from 'lucide-react'
import { getHighlights, addHighlight, updateHighlight, deleteHighlight } from '../lib/api'
import ImageUpload from '../components/ImageUpload'
import {
  AdminPage, AdminPanel, AdminPrimaryButton, AdminSecondaryButton,
  AdminIconButton, AdminModal, AdminTable, AdminTh, AdminTd,
  FormField, FormInput, FormTextarea,
} from './AdminUi'

const EMPTY = { title: '', description: '', image_url: '', display_order: 0 }

export default function ManageHighlights() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    document.title = 'Highlights — KP Dev Cell Admin'
    fetch_()
  }, [])

  async function fetch_() {
    setLoading(true)
    const { data } = await getHighlights()
    setItems(data || [])
    setLoading(false)
  }

  function openAdd() { setEditing(null); setForm(EMPTY); setError(''); setModal(true) }

  function openEdit(h) {
    setEditing(h)
    setForm({ title: h.title || '', description: h.description || '', image_url: h.image_url || '', display_order: h.display_order ?? 0 })
    setError(''); setModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.image_url) { setError('Please upload an image first.'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, image_url: form.image_url, display_order: Number(form.display_order) || 0 }
      const { error: err } = editing
        ? await updateHighlight(editing.id, payload)
        : await addHighlight(payload)
      if (err) { setError(err.message || 'Save failed'); return }
      setModal(false); fetch_()
    } catch (err) { setError(err?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this photo?')) return
    await deleteHighlight(id); fetch_()
  }

  return (
    <AdminPage
      title="Highlights Gallery"
      description="Upload photos from workshops, events, and club activities. These appear in the interactive gallery on the Highlights page."
      action={<AdminPrimaryButton onClick={openAdd}><Plus size={16} /> Add Photo</AdminPrimaryButton>}
    >
      <AdminPanel>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1b232d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Images size={16} style={{ color: '#67c7ff' }} />
            <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.95rem', color: '#fff', margin: 0 }}>Event Photos</h2>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#6b7785' }}>{items.length} photos</span>
        </div>

        {/* Photo grid preview */}
        {!loading && items.length > 0 && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #1b232d', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {items.map(item => (
              <div key={item.id} style={{ position: 'relative', width: 80, height: 60, borderRadius: 8, overflow: 'hidden', border: '1px solid #1e2a38' }}>
                <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
              </div>
            ))}
          </div>
        )}

        <AdminTable minWidth={620}>
          <thead>
            <tr>
              <AdminTh>Photo</AdminTh>
              <AdminTh>Title</AdminTh>
              <AdminTh>Description</AdminTh>
              <AdminTh>Order</AdminTh>
              <AdminTh>Actions</AdminTh>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>{[...Array(5)].map((__, j) => (
                  <AdminTd key={j}><div className="skeleton" style={{ height: 14, width: j === 0 ? 48 : 80, borderRadius: 4 }} /></AdminTd>
                ))}</tr>
              ))
            ) : items.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center', color: '#4a5568' }}>
                No photos yet. Add event photos to populate the gallery.
              </td></tr>
            ) : items.map(h => (
              <tr key={h.id} style={{ transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#0f1820'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <AdminTd>
                  {h.image_url
                    ? <img src={h.image_url} alt={h.title} style={{ width: 52, height: 40, borderRadius: 6, objectFit: 'cover', border: '1px solid #1e2a38' }} onError={e => e.target.style.display = 'none'} />
                    : <div style={{ width: 52, height: 40, borderRadius: 6, background: '#0f1820', border: '1px solid #1e2a38', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Images size={14} style={{ color: '#2a3a4a' }} /></div>
                  }
                </AdminTd>
                <AdminTd style={{ color: '#fff', fontWeight: 500 }}>{h.title || '—'}</AdminTd>
                <AdminTd><div style={{ maxWidth: 260, color: '#8b95a3' }}>{h.description?.slice(0, 80) || '—'}</div></AdminTd>
                <AdminTd style={{ color: '#6b7785' }}>{h.display_order ?? 0}</AdminTd>
                <AdminTd>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <AdminIconButton onClick={() => openEdit(h)} title="Edit"><Pencil size={14} /></AdminIconButton>
                    <AdminIconButton tone="danger" onClick={() => handleDelete(h.id)} title="Delete"><Trash2 size={14} /></AdminIconButton>
                  </div>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </AdminPanel>

      {modal && (
        <AdminModal title={editing ? 'Edit Photo' : 'Add Photo'} onClose={() => setModal(false)} maxWidth="580px">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && (
                <div style={{ padding: '10px 14px', background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 8, color: '#ff6b6b', fontSize: '0.85rem' }}>
                  ⚠ {error}
                </div>
              )}

              {/* Image upload — primary */}
              <ImageUpload
                bucket="highlights"
                pathPrefix="highlight-photos"
                currentUrl={form.image_url}
                onUpload={url => setForm({ ...form, image_url: url })}
                label="Event Photo *"
                maxSize={10}
                helperText="Workshop, hackathon, or event photo. Landscape orientation works best."
              />

              {/* URL fallback */}
              <FormField label="Or paste image URL">
                <FormInput type="url" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, alignItems: 'end' }}>
                <FormField label="Caption / Title">
                  <FormInput value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Web Dev Workshop — March 2025" />
                </FormField>
                <FormField label="Order">
                  <FormInput type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: e.target.value })} style={{ width: 72 }} min={0} />
                </FormField>
              </div>

              <FormField label="Short Description (optional)">
                <FormTextarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief context about the photo…" />
              </FormField>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
                <AdminSecondaryButton type="button" onClick={() => setModal(false)}>Cancel</AdminSecondaryButton>
                <AdminPrimaryButton type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Photo'}
                </AdminPrimaryButton>
              </div>
            </div>
          </form>
        </AdminModal>
      )}
    </AdminPage>
  )
}