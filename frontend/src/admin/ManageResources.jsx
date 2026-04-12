import { useEffect, useState } from 'react'
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react'
import { getPosts, addPost, updatePost, deletePost } from '../lib/api'
import ImageUpload from '../components/ImageUpload'
import StorageUpload from '../components/StorageUpload'
import {
  AdminPage, AdminPanel, AdminPrimaryButton, AdminSecondaryButton,
  AdminIconButton, AdminModal, AdminTable, AdminTh, AdminTd,
  FormField, FormInput, FormTextarea,
} from './AdminUi'

const EMPTY_R = {
  title: '', content: '', author_name: '',
  tags: '', pdf_url: '', cover_url: '', is_published: false,
}

export default function ManageResources() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_R)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Resources — KP Dev Cell Admin'
    fetch_()
  }, [])

  async function fetch_() {
    setLoading(true)
    const { data, error: fetchError } = await getPosts(false)
    if (fetchError) console.error(fetchError)
    setPosts(data || [])
    setLoading(false)
  }

  function openAdd() { setEditing(null); setForm(EMPTY_R); setError(''); setModal(true) }

  function openEdit(p) {
    setEditing(p)
    setForm({
      title: p.title || '',
      content: p.content || '',
      author_name: p.author_name || '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || '',
      pdf_url: p.pdf_url || '',
      cover_url: p.cover_url || '',
      is_published: p.is_published ?? false,
    })
    setError('')
    setModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, pdf_url: form.pdf_url || null, cover_url: form.cover_url || null }
      const { error: err } = editing
        ? await updatePost(editing.id, payload)
        : await addPost(payload)
      if (err) { setError(err.message || 'Save failed'); return }
      setModal(false); fetch_()
    } catch (err) {
      setError(err?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this resource?')) return
    await deletePost(id); fetch_()
  }

  async function togglePublish(p) {
    await updatePost(p.id, { is_published: !p.is_published }); fetch_()
  }

  return (
    <AdminPage
      title="Resources"
      description="Publish notes, tutorials, and learning material. Upload PDFs directly or paste external links."
      action={<AdminPrimaryButton onClick={openAdd}><Plus size={16} /> Add Resource</AdminPrimaryButton>}
    >
      <AdminPanel>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1b232d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.95rem', color: '#fff', margin: 0 }}>Resources</h2>
          <span style={{ fontSize: '0.8rem', color: '#6b7785' }}>{posts.length} total</span>
        </div>
        <AdminTable minWidth={820}>
          <thead>
            <tr>
              <AdminTh>Title</AdminTh>
              <AdminTh>Author</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Tags</AdminTh>
              <AdminTh>PDF</AdminTh>
              <AdminTh>Actions</AdminTh>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>{[...Array(6)].map((__, j) => (
                  <AdminTd key={j}><div className="skeleton" style={{ height: 14, width: 80, borderRadius: 4 }} /></AdminTd>
                ))}</tr>
              ))
            ) : posts.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#4a5568' }}>No resources yet.</td></tr>
            ) : posts.map((p) => (
              <tr key={p.id} style={{ transition: 'background 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#0f1820')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <AdminTd>
                  <div style={{ maxWidth: 280 }}>
                    <p style={{ color: '#fff', fontWeight: 500, margin: 0 }}>{p.title}</p>
                    <p style={{ color: '#6b7785', fontSize: '0.78rem', margin: '3px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260 }}>
                      {p.content?.slice(0, 60) || '—'}
                    </p>
                  </div>
                </AdminTd>
                <AdminTd>{p.author_name || '—'}</AdminTd>
                <AdminTd>
                  <button onClick={() => togglePublish(p)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 500, border: 'none', cursor: 'pointer', background: p.is_published ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)', color: p.is_published ? '#00ff88' : '#7a8694', transition: 'background 0.15s' }}>
                    {p.is_published ? <Eye size={12} /> : <EyeOff size={12} />}
                    {p.is_published ? 'Published' : 'Draft'}
                  </button>
                </AdminTd>
                <AdminTd style={{ color: '#8b95a3' }}>{p.tags || '—'}</AdminTd>
                <AdminTd>
                  {p.pdf_url ? (
                    <a href={p.pdf_url} target="_blank" rel="noopener noreferrer" style={{ color: '#57a2ff', fontSize: '0.78rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                      PDF ↗
                    </a>
                  ) : <span style={{ color: '#3a4450' }}>—</span>}
                </AdminTd>
                <AdminTd>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <AdminIconButton onClick={() => openEdit(p)} title="Edit"><Pencil size={14} /></AdminIconButton>
                    <AdminIconButton tone="danger" onClick={() => handleDelete(p.id)} title="Delete"><Trash2 size={14} /></AdminIconButton>
                  </div>
                </AdminTd>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </AdminPanel>

      {modal && (
        <AdminModal title={editing ? 'Edit Resource' : 'Add Resource'} onClose={() => setModal(false)} maxWidth="700px">
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

              <FormField label="Content" required>
                <FormTextarea required rows={9} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your content here..." style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem' }} />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="Author Name">
                  <FormInput value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} />
                </FormField>
                <FormField label="Tags (comma separated)">
                  <FormInput value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="web, security, tutorial" />
                </FormField>
              </div>

              {/* Cover image upload */}
              <ImageUpload
                bucket="projects"
                pathPrefix="resource-covers"
                currentUrl={form.cover_url}
                onUpload={(url) => setForm({ ...form, cover_url: url })}
                label="Cover Image (optional)"
                maxSize={5}
                helperText="Shown as thumbnail on the resources page."
              />

              {/* ── PDF UPLOAD — full Supabase storage upload ── */}
              <div style={{ padding: '14px 16px', background: '#0f1820', border: '1px solid #1b2a3d', borderRadius: 12 }}>
                <p style={{ margin: '0 0 10px', fontSize: '0.8rem', color: '#8a9aaa', fontWeight: 500 }}>
                  PDF / Attachment
                </p>
                {/* Upload directly to Supabase storage */}
                <StorageUpload
                  bucket="projects"
                  pathPrefix="resource-pdfs"
                  currentUrl={form.pdf_url}
                  onUpload={(url) => setForm({ ...form, pdf_url: url })}
                  label=""
                  accept="application/pdf,.pdf"
                  fileTypeLabel="PDF"
                  maxSize={20}
                  helperText="Upload PDF directly — or paste an external URL below."
                />
                {/* External URL fallback */}
                <div style={{ marginTop: 10 }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#5a6575', marginBottom: 5 }}>
                    Or paste external PDF URL
                  </label>
                  <FormInput
                    type="url"
                    value={form.pdf_url}
                    onChange={(e) => setForm({ ...form, pdf_url: e.target.value })}
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>

              {/* Publish toggle */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#10161e', border: '1px solid #1e2a38', borderRadius: 12, cursor: 'pointer' }}
                onClick={() => setForm({ ...form, is_published: !form.is_published })}
              >
                <div style={{ width: 40, height: 22, borderRadius: 11, background: form.is_published ? '#00ff88' : '#1e2a38', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
                  <div style={{ position: 'absolute', top: 2, left: form.is_published ? 20 : 2, width: 18, height: 18, borderRadius: '50%', background: form.is_published ? '#000' : '#4a5568', transition: 'left 0.2s' }} />
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#fff', margin: 0 }}>Publish immediately</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7785', margin: 0 }}>Disable to save as draft.</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
                <AdminSecondaryButton type="button" onClick={() => setModal(false)}>Cancel</AdminSecondaryButton>
                <AdminPrimaryButton type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Publish Resource'}
                </AdminPrimaryButton>
              </div>
            </div>
          </form>
        </AdminModal>
      )}
    </AdminPage>
  )
}