import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from '../lib/api'
import ImageUpload from '../components/ImageUpload'
import {
  AdminPage, AdminPanel, AdminPrimaryButton, AdminSecondaryButton,
  AdminIconButton, AdminModal, AdminTable, AdminTh, AdminTd,
  FormField, FormInput, FormTextarea, FormSelect, FormToggle, StatusBadge,
} from './AdminUi'

const EMPTY = {
  name: '', role: '', bio: '', photo_url: '',
  github: '', linkedin: '', batch_year: '',
  category: 'core', domain: '', is_active: true,
}

const CATEGORIES = ['coordinator', 'core', 'advisor']
const DOMAINS = [
  { value: '', label: '— None —' },
  { value: 'web', label: 'Web Development' },
  { value: 'infosec', label: 'InfoSec & CTF' },
  { value: 'sysadmin', label: 'System Administration' },
  { value: 'opensource', label: 'Open Source & AI' },
]

export default function ManageTeam() {
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Manage Team — KP Dev Cell Admin'
    fetchMembers()
  }, [])

  async function fetchMembers() {
    setLoading(true)
    const { data, error: fetchError } = await getTeamMembers()
    if (fetchError) console.error('Fetch members error:', fetchError)
    setMembers(data || [])
    setLoading(false)
  }

  function openAdd() {
    setEditing(null)
    setForm(EMPTY)
    setError('')
    setShowModal(true)
  }

  function openEdit(m) {
    setEditing(m)
    setForm({
      name: m.name || '',
      role: m.role || '',
      bio: m.bio || '',
      photo_url: m.photo_url || '',
      github: m.github || '',
      linkedin: m.linkedin || '',
      batch_year: m.batch_year || '',
      category: m.category || 'core',
      domain: m.domain || '',
      is_active: m.is_active ?? true,
    })
    setError('')
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const payload = {
        ...form,
        batch_year: form.batch_year ? parseInt(form.batch_year, 10) : null,
        photo_url: form.photo_url || null,
        github: form.github || null,
        linkedin: form.linkedin || null,
        bio: form.bio || null,
        domain: form.domain || null,
      }

      const { error: err } = editing
        ? await updateTeamMember(editing.id, payload)
        : await addTeamMember(payload)

      if (err) {
        setError(err.message || 'Save failed. Check Supabase RLS policies.')
        return
      }

      setShowModal(false)
      fetchMembers()
    } catch (err) {
      setError(err?.message || 'Save failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this team member?')) return
    await deleteTeamMember(id)
    fetchMembers()
  }

  const filtered = members.filter(
    (m) =>
      !search ||
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.role?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminPage
      title="Manage Team"
      description="Add coordinators, core members, and advisors. Assign domains to categorise members by area."
      action={
        <AdminPrimaryButton onClick={openAdd}>
          <Plus size={16} /> Add Member
        </AdminPrimaryButton>
      }
    >
      <div>
        <FormInput
          placeholder="Search by name or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      <AdminPanel>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid #1b232d',
          flexWrap: 'wrap', gap: 8,
        }}>
          <div>
            <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.95rem', fontWeight: 600, color: '#fff', margin: 0 }}>
              Team Members
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#6b7785', margin: '4px 0 0' }}>
              {filtered.length} member{filtered.length !== 1 ? 's' : ''} shown
            </p>
          </div>
        </div>

        <AdminTable minWidth={820}>
          <thead>
            <tr>
              <AdminTh>Member</AdminTh>
              <AdminTh>Role</AdminTh>
              <AdminTh>Category</AdminTh>
              <AdminTh>Domain</AdminTh>
              <AdminTh>Batch</AdminTh>
              <AdminTh>Status</AdminTh>
              <AdminTh>Actions</AdminTh>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}>
                  {[...Array(7)].map((__, j) => (
                    <AdminTd key={j}>
                      <div className="skeleton" style={{ height: 14, width: j === 0 ? 160 : 80, borderRadius: 4 }} />
                    </AdminTd>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#4a5568', fontSize: '0.9rem' }}>
                  {search ? 'No members match your search.' : 'No team members yet. Add the first one!'}
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr
                  key={m.id}
                  style={{ transition: 'background 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#0f1820')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <AdminTd>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {m.photo_url ? (
                        <img
                          src={m.photo_url}
                          alt={m.name}
                          style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '1px solid #1e2a38', flexShrink: 0 }}
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: 'linear-gradient(135deg, #00ff8822, #0066ff22)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: '#00ff88', flexShrink: 0,
                        }}>
                          {m.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'}
                        </div>
                      )}
                      <span style={{ color: '#fff', fontWeight: 500 }}>{m.name}</span>
                    </div>
                  </AdminTd>
                  <AdminTd>{m.role || '-'}</AdminTd>
                  <AdminTd>
                    <span style={{
                      display: 'inline-block', padding: '2px 10px', borderRadius: 100, fontSize: '0.72rem',
                      background: m.category === 'coordinator' ? 'rgba(255,107,107,0.1)' : m.category === 'advisor' ? 'rgba(251,191,36,0.1)' : 'rgba(0,255,136,0.08)',
                      color: m.category === 'coordinator' ? '#ff6b6b' : m.category === 'advisor' ? '#fbbf24' : '#00ff88',
                      border: `1px solid ${m.category === 'coordinator' ? 'rgba(255,107,107,0.2)' : m.category === 'advisor' ? 'rgba(251,191,36,0.2)' : 'rgba(0,255,136,0.15)'}`,
                      textTransform: 'capitalize',
                    }}>
                      {m.category}
                    </span>
                  </AdminTd>
                  <AdminTd>{m.domain ? DOMAINS.find(d => d.value === m.domain)?.label || m.domain : '-'}</AdminTd>
                  <AdminTd>{m.batch_year || '-'}</AdminTd>
                  <AdminTd><StatusBadge active={m.is_active} /></AdminTd>
                  <AdminTd>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <AdminIconButton onClick={() => openEdit(m)} title="Edit"><Pencil size={14} /></AdminIconButton>
                      <AdminIconButton tone="danger" onClick={() => handleDelete(m.id)} title="Delete"><Trash2 size={14} /></AdminIconButton>
                    </div>
                  </AdminTd>
                </tr>
              ))
            )}
          </tbody>
        </AdminTable>
      </AdminPanel>

      {showModal && (
        <AdminModal
          title={editing ? 'Edit Member' : 'Add Member'}
          onClose={() => setShowModal(false)}
          maxWidth="640px"
        >
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && (
                <div style={{ padding: '10px 14px', background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)', borderRadius: 8, color: '#ff6b6b', fontSize: '0.85rem' }}>
                  ⚠ {error}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="Full Name" required>
                  <FormInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rahul Sharma" />
                </FormField>
                <FormField label="Role / Title" required>
                  <FormInput required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Frontend Dev" />
                </FormField>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="Category">
                  <FormSelect value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0d1218' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </FormSelect>
                </FormField>
                <FormField label="Domain">
                  <FormSelect value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })}>
                    {DOMAINS.map(d => <option key={d.value} value={d.value} style={{ background: '#0d1218' }}>{d.label}</option>)}
                  </FormSelect>
                </FormField>
              </div>

              <FormField label="Bio">
                <FormTextarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Short description..." />
              </FormField>

              {/* Photo upload — primary method */}
              <ImageUpload
                bucket="avatars"
                currentUrl={form.photo_url}
                onUpload={(url) => setForm({ ...form, photo_url: url })}
                label="Photo"
                maxSize={4}
                helperText="Upload photo directly. Or paste a URL below."
              />

              {/* URL fallback */}
              <FormField label="Photo URL (optional fallback)">
                <FormInput
                  type="url"
                  value={form.photo_url}
                  onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
                  placeholder="https://..."
                />
              </FormField>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="GitHub URL">
                  <FormInput type="url" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/..." />
                </FormField>
                <FormField label="LinkedIn URL">
                  <FormInput type="url" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
                </FormField>
              </div>

              <FormField label="Batch Year">
                <FormInput type="number" value={form.batch_year} onChange={(e) => setForm({ ...form, batch_year: e.target.value })} placeholder="e.g. 2024" min="2000" max="2030" />
              </FormField>

              <FormToggle
                checked={form.is_active}
                onChange={() => setForm({ ...form, is_active: !form.is_active })}
                label="Active member"
                helper="Inactive members are hidden from the public team page."
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
                <AdminSecondaryButton type="button" onClick={() => setShowModal(false)}>Cancel</AdminSecondaryButton>
                <AdminPrimaryButton type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Member'}
                </AdminPrimaryButton>
              </div>
            </div>
          </form>
        </AdminModal>
      )}
    </AdminPage>
  )
}