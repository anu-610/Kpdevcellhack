import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2, ExternalLink } from 'lucide-react'
import { getProjects, addProject, updateProject, deleteProject } from '../lib/api'
import ImageUpload from '../components/ImageUpload'
import {
  AdminPage, AdminPanel, AdminPrimaryButton, AdminSecondaryButton,
  AdminIconButton, AdminModal, AdminTable, AdminTh, AdminTd,
  FormField, FormInput, FormTextarea,
} from './AdminUi'

const EMPTY_P = {
  title: '', description: '', tech_tags: '',
  github_url: '', live_url: '', image_url: '',
}

export default function ManageProjects() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_P)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Projects — KP Dev Cell Admin'
    fetch_()
  }, [])

  async function fetch_() {
    setLoading(true)
    const { data, error: fetchError } = await getProjects()
    if (fetchError) console.error(fetchError)
    setItems(data || [])
    setLoading(false)
  }

  function openAdd() {
    setEditing(null)
    setForm(EMPTY_P)
    setError('')
    setModal(true)
  }

  function openEdit(p) {
    setEditing(p)
    setForm({
      title: p.title || '',
      description: p.description || '',
      tech_tags: Array.isArray(p.tech_tags) ? p.tech_tags.join(', ') : p.tech_tags || '',
      github_url: p.github_url || '',
      live_url: p.live_url || '',
      image_url: p.image_url || '',
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
        github_url: form.github_url || null,
        live_url: form.live_url || null,
        image_url: form.image_url || null,
      }

      const { error: err } = editing
        ? await updateProject(editing.id, payload)
        : await addProject(payload)

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
    if (!confirm('Delete this project?')) return
    await deleteProject(id)
    fetch_()
  }

  return (
    <AdminPage
      title="Projects"
      description="Manage the club's portfolio. Add GitHub links, descriptions, and tech stacks."
      action={<AdminPrimaryButton onClick={openAdd}><Plus size={16} /> Add Project</AdminPrimaryButton>}
    >
      <AdminPanel>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1b232d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.95rem', color: '#fff', margin: 0 }}>Projects</h2>
          <span style={{ fontSize: '0.8rem', color: '#6b7785' }}>{items.length} total</span>
        </div>
        <AdminTable minWidth={700}>
          <thead>
            <tr>
              <AdminTh>Image</AdminTh>
              <AdminTh>Title</AdminTh>
              <AdminTh>Description</AdminTh>
              <AdminTh>Tech</AdminTh>
              <AdminTh>Links</AdminTh>
              <AdminTh>Actions</AdminTh>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}>{[...Array(6)].map((__, j) => <AdminTd key={j}><div className="skeleton" style={{ height: 14, width: 80, borderRadius: 4 }} /></AdminTd>)}</tr>
              ))
            ) : items.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#4a5568' }}>No projects yet.</td></tr>
            ) : items.map((p) => (
              <tr
                key={p.id}
                style={{ transition: 'background 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#0f1820')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <AdminTd>
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} style={{ width: 48, height: 36, borderRadius: 6, objectFit: 'cover', border: '1px solid #1e2a38' }} onError={(e) => { e.target.style.display = 'none' }} />
                  ) : (
                    <div style={{ width: 48, height: 36, borderRadius: 6, background: 'rgba(255,138,101,0.08)', border: '1px solid rgba(255,138,101,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1rem' }}>📁</span>
                    </div>
                  )}
                </AdminTd>
                <AdminTd style={{ color: '#fff', fontWeight: 500 }}>{p.title}</AdminTd>
                <AdminTd><div style={{ maxWidth: 220, color: '#8b95a3' }}>{p.description?.slice(0, 80) || '—'}</div></AdminTd>
                <AdminTd style={{ color: '#8b95a3', fontSize: '0.8rem' }}>{p.tech_tags || '—'}</AdminTd>
                <AdminTd>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noopener noreferrer" style={{ color: '#7a8694', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                        GitHub <ExternalLink size={11} />
                      </a>
                    )}
                    {p.live_url && (
                      <a href={p.live_url} target="_blank" rel="noopener noreferrer" style={{ color: '#7a8694', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                        Live <ExternalLink size={11} />
                      </a>
                    )}
                    {!p.github_url && !p.live_url && '—'}
                  </div>
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
        <AdminModal title={editing ? 'Edit Project' : 'Add Project'} onClose={() => setModal(false)} maxWidth="600px">
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
                <FormTextarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </FormField>

              <FormField label="Tech Tags (comma separated)">
                <FormInput value={form.tech_tags} onChange={(e) => setForm({ ...form, tech_tags: e.target.value })} placeholder="React, Node.js, PostgreSQL" />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="GitHub URL">
                  <FormInput type="url" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." />
                </FormField>
                <FormField label="Live URL">
                  <FormInput type="url" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} placeholder="https://..." />
                </FormField>
              </div>

              {/* Project image upload */}
              <ImageUpload
                bucket="projects"
                pathPrefix="project-images"
                currentUrl={form.image_url}
                onUpload={(url) => setForm({ ...form, image_url: url })}
                label="Project Screenshot / Thumbnail"
                maxSize={8}
                helperText="Shown on the public projects page."
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
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Project'}
                </AdminPrimaryButton>
              </div>
            </div>
          </form>
        </AdminModal>
      )}
    </AdminPage>
  )
}