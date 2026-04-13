import { useState, useEffect } from 'react'
import { auth } from '../../firebase.js'
import api from '../../api.js'
import toast from 'react-hot-toast'

const emptyForm = {
  name: '', role: '', bio: '', photo_url: '',
  github: '', linkedin: '', batch: '', isCore: false
}

const FIELDS = [
  { label: 'name',       name: 'name',      type: 'text',  required: true,  placeholder: '"John Doe"' },
  { label: 'role',       name: 'role',      type: 'text',  required: true,  placeholder: '"Full Stack Dev"' },
  { label: 'team',      name: 'batch',     type: 'text',  required: true,  placeholder: '"backend"' },
  { label: 'photo_url',  name: 'photo_url', type: 'text',  required: false, placeholder: '"https://..."' },
  { label: 'github',     name: 'github',    type: 'text',  required: false, placeholder: '"https://github.com/..."' },
  { label: 'linkedin',   name: 'linkedin',  type: 'text',  required: false, placeholder: '"https://linkedin.com/..."' },
]

/* ── Shared input style ── */
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

/* ── Member row in the file tree sidebar ── */
function MemberTreeItem({ member, isSelected, onSelect, onEdit, onDelete, isMobile }) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
    >
      <div
        onClick={() => onSelect(member)}
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
        {/* Photo or avatar */}
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.name}
            style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <div style={{
            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
            backgroundColor: 'rgba(20,184,166,0.15)',
            border: '1px solid rgba(20,184,166,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, color: '#14B8A6', fontWeight: 700,
          }}>
            {member.name?.[0]?.toUpperCase()}
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 12, color: isSelected ? '#e2e8f0' : '#9CA3AF',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
          }}>
            {member.name}
          </div>
          <div style={{
            fontSize: 10, color: '#374151',
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {member.role}
          </div>
        </div>

        {/* Context menu trigger */}
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
            onClick={() => { onEdit(member); setMenuOpen(false) }}
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
            $ edit member
          </button>
          <button
            onClick={() => { onDelete(member._id); setMenuOpen(false) }}
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
            $ rm member
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Member detail panel ── */
function MemberDetail({ member, isMobile }) {
  if (!member) return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: '#374151', fontFamily: '"Fira Code", "Cascadia Code", monospace',
    }}>
      <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>📄</div>
      <div style={{ fontSize: 13 }}>select a member to preview</div>
      <div style={{ fontSize: 11, marginTop: 4, color: '#1f2937' }}>member_info — bash</div>
    </div>
  )

  const fields = [
    { key: 'name',     val: member.name },
    { key: 'role',     val: member.role },
    { key: 'batch',    val: member.batch },
    { key: 'isCore',   val: member.isCore ? 'true' : 'false' },
    { key: 'github',   val: member.github || 'null' },
    { key: 'linkedin', val: member.linkedin || 'null' },
    { key: 'bio',      val: member.bio || 'null' },
  ]

  return (
    <div style={{
      flex: 1, overflow: 'auto',
      fontFamily: '"Fira Code", "Cascadia Code", monospace',
    }}>
      {/* Terminal title bar */}
      <div style={{
        padding: '10px 16px',
        backgroundColor: 'rgba(13,17,23,0.6)',
        borderBottom: '1px solid rgba(20,184,166,0.1)',
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 12, color: '#4B5563',
      }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5F57','#FFBD2E','#28CA41'].map((c,i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: c, opacity: 0.7 }} />
          ))}
        </div>
        <span style={{ marginLeft: 6 }}>member_info — bash</span>
      </div>

      <div style={{ padding: isMobile ? '16px 12px' : '20px 20px' }}>
        {/* Avatar + name header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          {member.photo_url ? (
            <img src={member.photo_url} alt={member.name}
              style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover',
                border: '2px solid rgba(20,184,166,0.4)',
                boxShadow: '0 0 16px rgba(20,184,166,0.2)' }}
              onError={e => e.target.style.display='none'}
            />
          ) : (
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(20,184,166,0.2), rgba(139,91,246,0.2))',
              border: '2px solid rgba(20,184,166,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, color: '#14B8A6', fontWeight: 700,
            }}>
              {member.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ color: '#e2e8f0', fontSize: 15, fontWeight: 600 }}>{member.name}</div>
            <div style={{ color: '#14B8A6', fontSize: 12, marginTop: 2 }}>{member.role}</div>
          </div>
          {member.isCore && (
            <div style={{
              marginLeft: isMobile ? 0 : 'auto',
              backgroundColor: 'rgba(20,184,166,0.1)',
              border: '1px solid rgba(20,184,166,0.3)',
              borderRadius: 20, padding: '3px 10px',
              fontSize: 10, color: '#14B8A6', letterSpacing: '0.1em',
            }}>
              CORE
            </div>
          )}
        </div>

        {/* cat member.json */}
        <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 10 }}>
          <span style={{ color: '#14B8A6' }}>$ </span>cat member.json
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
              <span style={{ color: key === 'isCore' ? (val === 'true' ? '#4ade80' : '#ef4444') : '#e2e8f0' }}>
                "{val}"
              </span>
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
function MembersAdmin() {
  const [members, setMembers]     = useState([])
  const [form, setForm]           = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading]     = useState(false)
  const [selected, setSelected]   = useState(null)
  const [view, setView]           = useState('form') // 'form' | 'preview'
  const [isMobile, setIsMobile]   = useState(() => window.innerWidth <= 900)
  const [treeOpen, setTreeOpen]   = useState(true)

  useEffect(() => { fetchMembers() }, [])

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 900
      setIsMobile(mobile)
      if (!mobile) setTreeOpen(true)
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members')
      setMembers(res.data)
    } catch {
      toast.error('Failed to fetch members')
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
      const config = await getToken()
      if (editingId) {
        await api.put(`/members/${editingId}`, form, config)
        toast.success('Member updated')
      } else {
        await api.post('/members', form, config)
        toast.success('Member added')
      }
      setForm(emptyForm)
      setEditingId(null)
      fetchMembers()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (member) => {
    setForm({
      name: member.name, role: member.role, bio: member.bio,
      photo_url: member.photo_url, github: member.github,
      linkedin: member.linkedin, batch: member.batch, isCore: member.isCore
    })
    setEditingId(member._id)
    setView('form')
  }

  const handleDelete = async (id) => {
    if (!confirm('rm -rf member? This cannot be undone.')) return
    try {
      const config = await getToken()
      await api.delete(`/members/${id}`, config)
      toast.success('Member removed')
      if (selected?._id === id) setSelected(null)
      fetchMembers()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSelect = (member) => {
    setSelected(member)
    setView('preview')
    if (isMobile) setTreeOpen(false)
  }

  return (
    <>
      <style>{`
        .members-admin-input:hover {
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
      `}</style>

      {/* ── IDE-style 3-panel layout ── */}
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

        {/* ── Left: file tree of members ── */}
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
              MEMBERS ({members.length})
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
              title="Add new member"
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
              {treeOpen ? '$ hide member explorer' : '$ show member explorer'}
            </button>
          )}

          {/* Folder label */}
          <div style={{
            padding: '8px 12px', fontSize: 11,
            color: '#374151', fontFamily: '"Fira Code", "Cascadia Code", monospace',
            display: 'flex', alignItems: 'center', gap: 6,
            display: !isMobile || treeOpen ? 'flex' : 'none',
          }}>
            <span>▾</span>
            <span>📁 members/</span>
          </div>

          {/* Member list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            paddingBottom: 12,
            maxHeight: isMobile ? 260 : 'none',
            display: !isMobile || treeOpen ? 'block' : 'none',
          }}>
            {members.length === 0 ? (
              <div style={{
                padding: '20px 14px', fontSize: 11,
                color: '#374151', fontFamily: '"Fira Code", "Cascadia Code", monospace',
                textAlign: 'center',
              }}>
                no members yet
              </div>
            ) : (
              members.map(m => (
                <MemberTreeItem
                  key={m._id}
                  member={m}
                  isSelected={selected?._id === m._id && view === 'preview'}
                  onSelect={handleSelect}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                    isMobile={isMobile}
                />
              ))
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
            { id: 'form', label: editingId ? '✏️ edit_member.js' : '➕ new_member.js' },
            { id: 'preview', label: `👁 preview${selected ? ` — ${selected.name}` : ''}` },
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
                <div>{'// ' + (editingId ? 'editing existing member record' : 'adding new member to db')}</div>
                <div>{'// all required fields must be non-null'}</div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Fields grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 16, marginBottom: 16,
                }}>
                  {FIELDS.map(f => (
                    <TermInput
                      key={f.name}
                      label={f.label}
                      name={f.name}
                      type={f.type}
                      value={form[f.name]}
                      onChange={handleChange}
                      required={f.required}
                      placeholder={f.placeholder}
                    />
                  ))}
                </div>

                {/* Bio full width */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{
                    display: 'block', marginBottom: 5,
                    fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: '#4B5563', fontFamily: '"Fira Code", "Cascadia Code", monospace',
                  }}>
                    <span style={{ color: '#374151' }}>const </span>
                    <span style={{ color: '#9CA3AF' }}>bio</span>
                    <span style={{ color: '#374151' }}> =</span>
                  </label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={3}
                    placeholder='"A short bio..."'
                    style={{
                      ...inputStyle,
                      resize: 'vertical',
                      lineHeight: 1.6,
                    }}
                  />
                </div>

                {/* isCore checkbox */}
                <label style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  cursor: 'pointer', marginBottom: 22,
                  fontFamily: '"Fira Code", "Cascadia Code", monospace',
                  fontSize: 12, color: '#6B7280',
                  backgroundColor: 'rgba(20,184,166,0.05)',
                  border: '1px solid rgba(20,184,166,0.12)',
                  borderRadius: 8, padding: '8px 14px',
                }}>
                  <input
                    type="checkbox"
                    name="isCore"
                    checked={form.isCore}
                    onChange={handleChange}
                    style={{ accentColor: '#14B8A6', width: 14, height: 14 }}
                  />
                  <span>
                    <span style={{ color: '#374151' }}>isCore</span>
                    <span style={{ color: '#6B7280' }}> = </span>
                    <span style={{ color: form.isCore ? '#4ade80' : '#ef4444' }}>
                      {form.isCore ? 'true' : 'false'}
                    </span>
                  </span>
                </label>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button type="submit" disabled={loading} className="term-btn-primary">
                    {loading ? '$ executing...' : editingId ? '$ git commit -m "update"' : '$ git add member'}
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
            <MemberDetail member={selected} isMobile={isMobile} />
          )}
        </div>
      </div>
    </>
  )
}

export default MembersAdmin