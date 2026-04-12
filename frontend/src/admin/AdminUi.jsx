import { X } from 'lucide-react'

function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────
export function AdminPage({ title, description, action, children }) {
  return (
    <div
      style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '32px 24px 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          paddingBottom: 24,
          borderBottom: '1px solid #1a2030',
        }}
      >
        <div>
          <span
            style={{
              display: 'inline-block',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.65rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#00ff88',
              background: '#00ff8811',
              border: '1px solid #00ff8822',
              borderRadius: 100,
              padding: '4px 12px',
              marginBottom: 12,
            }}
          >
            Admin workspace
          </span>
          <h1
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 600,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </h1>
          {description && (
            <p style={{ marginTop: 6, fontSize: '0.9rem', color: '#6b7785', lineHeight: 1.6, maxWidth: 600 }}>
              {description}
            </p>
          )}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </header>

      {children}
    </div>
  )
}

// ─── Card panel ───────────────────────────────────────────────────────────────
export function AdminPanel({ className = '', style = {}, children }) {
  return (
    <div
      className={className}
      style={{
        background: '#0d1218',
        border: '1px solid #1b232d',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── Buttons ──────────────────────────────────────────────────────────────────
export function AdminPrimaryButton({ className = '', children, style = {}, type = 'button', ...props }) {
  return (
    <button
      className={className}
      type={type}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '10px 18px',
        background: '#00ff88',
        color: '#000',
        border: 'none',
        borderRadius: 10,
        fontSize: '0.875rem',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(0,255,136,0.2)',
        transition: 'background 0.15s, box-shadow 0.15s, opacity 0.15s',
        opacity: props.disabled ? 0.5 : 1,
        ...style,
      }}
      onMouseEnter={(e) => { if (!props.disabled) e.currentTarget.style.background = '#00e37a' }}
      onMouseLeave={(e) => { e.currentTarget.style.background = '#00ff88' }}
      {...props}
    >
      {children}
    </button>
  )
}

export function AdminSecondaryButton({ className = '', children, style = {}, type = 'button', ...props }) {
  return (
    <button
      className={className}
      type={type}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '10px 18px',
        background: '#10161e',
        color: '#ffffff',
        border: '1px solid #253041',
        borderRadius: 10,
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
        ...style,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#324154'; e.currentTarget.style.background = '#151d27' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#253041'; e.currentTarget.style.background = '#10161e' }}
      {...props}
    >
      {children}
    </button>
  )
}

export function AdminIconButton({ tone = 'default', className = '', style = {}, children, type = 'button', ...props }) {
  const isDanger = tone === 'danger'
  return (
    <button
      className={className}
      type={type}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        borderRadius: 8,
        border: '1px solid #1e2a38',
        background: 'transparent',
        color: '#7a8694',
        cursor: 'pointer',
        transition: 'color 0.15s, background 0.15s, border-color 0.15s',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = isDanger ? '#ff7b8b' : '#ffffff'
        e.currentTarget.style.background = isDanger ? '#2a1418' : '#131922'
        e.currentTarget.style.borderColor = isDanger ? '#3d1820' : '#2a3848'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#7a8694'
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.borderColor = '#1e2a38'
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export function AdminTabButton({ active = false, className = '', children, type = 'button', ...props }) {
  return (
    <button
      className={className}
      type={type}
      style={{
        padding: '8px 18px',
        borderRadius: 100,
        fontSize: '0.875rem',
        fontWeight: 500,
        border: active ? '1px solid rgba(0,255,136,0.2)' : '1px solid transparent',
        background: active ? 'rgba(0,255,136,0.08)' : 'transparent',
        color: active ? '#00ff88' : '#7a8694',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function AdminModal({ title, onClose, maxWidth = '520px', children }) {
  // Close on Escape key
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(6px)',
        padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0d1218',
          border: '1px solid #202937',
          borderRadius: 24,
          padding: '28px 28px 24px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          scrollbarWidth: 'thin',
          scrollbarColor: '#1e2a38 transparent',
        }}
      >
        {/* Modal header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '1.2rem',
                fontWeight: 600,
                color: '#ffffff',
                margin: 0,
              }}
            >
              {title}
            </h2>
            <p style={{ marginTop: 4, fontSize: '0.8rem', color: '#6b7785' }}>
              Fill in the details below and hit save.
            </p>
          </div>
          <AdminIconButton onClick={onClose} title="Close" style={{ flexShrink: 0 }}>
            <X size={16} />
          </AdminIconButton>
        </div>

        {children}
      </div>
    </div>
  )
}

// ─── Form field components (used inside modals) ───────────────────────────────
export function FormField({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label
        style={{
          fontSize: '0.8rem',
          color: '#8a9aaa',
          fontWeight: 500,
        }}
      >
        {label}
        {required && <span style={{ color: '#ff6b6b', marginLeft: 4 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

export function FormInput({ style = {}, ...props }) {
  return (
    <input
      style={{
        width: '100%',
        padding: '9px 12px',
        background: '#111922',
        border: '1px solid #1e2c3d',
        borderRadius: 8,
        color: '#ffffff',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'border-color 0.15s',
        boxSizing: 'border-box',
        ...style,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = '#00ff8866' }}
      onBlur={(e) => { e.currentTarget.style.borderColor = '#1e2c3d' }}
      {...props}
    />
  )
}

export function FormTextarea({ style = {}, ...props }) {
  return (
    <textarea
      style={{
        width: '100%',
        padding: '9px 12px',
        background: '#111922',
        border: '1px solid #1e2c3d',
        borderRadius: 8,
        color: '#ffffff',
        fontSize: '0.875rem',
        outline: 'none',
        resize: 'vertical',
        transition: 'border-color 0.15s',
        boxSizing: 'border-box',
        lineHeight: 1.6,
        ...style,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = '#00ff8866' }}
      onBlur={(e) => { e.currentTarget.style.borderColor = '#1e2c3d' }}
      {...props}
    />
  )
}

export function FormSelect({ style = {}, children, ...props }) {
  return (
    <select
      style={{
        width: '100%',
        padding: '9px 12px',
        background: '#111922',
        border: '1px solid #1e2c3d',
        borderRadius: 8,
        color: '#ffffff',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'border-color 0.15s',
        boxSizing: 'border-box',
        ...style,
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = '#00ff8866' }}
      onBlur={(e) => { e.currentTarget.style.borderColor = '#1e2c3d' }}
      {...props}
    >
      {children}
    </select>
  )
}

export function FormToggle({ checked, onChange, label, helper }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: '#10161e',
        border: '1px solid #1e2a38',
        borderRadius: 12,
        cursor: 'pointer',
      }}
      onClick={onChange}
    >
      {/* Track */}
      <div
        style={{
          width: 40,
          height: 22,
          borderRadius: 11,
          background: checked ? '#00ff88' : '#1e2a38',
          position: 'relative',
          flexShrink: 0,
          transition: 'background 0.2s',
          border: checked ? 'none' : '1px solid #2a3848',
        }}
      >
        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 20 : 2,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: checked ? '#000' : '#4a5568',
            transition: 'left 0.2s',
          }}
        />
      </div>
      <div>
        {label && <p style={{ fontSize: '0.875rem', color: '#ffffff', margin: 0 }}>{label}</p>}
        {helper && <p style={{ fontSize: '0.75rem', color: '#6b7785', margin: 0, marginTop: 2 }}>{helper}</p>}
      </div>
    </div>
  )
}

// ─── Table helpers ────────────────────────────────────────────────────────────
export function AdminTable({ children, minWidth = 700 }) {
  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table
        style={{
          width: '100%',
          minWidth,
          borderCollapse: 'collapse',
        }}
      >
        {children}
      </table>
    </div>
  )
}

export function AdminTh({ children, style = {} }) {
  return (
    <th
      style={{
        padding: '10px 20px',
        textAlign: 'left',
        fontSize: '0.68rem',
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#687280',
        borderBottom: '1px solid #1b232d',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </th>
  )
}

export function AdminTd({ children, style = {} }) {
  return (
    <td
      style={{
        padding: '14px 20px',
        fontSize: '0.875rem',
        color: '#c0cad4',
        borderBottom: '1px solid #131c27',
        verticalAlign: 'top',
        ...style,
      }}
    >
      {children}
    </td>
  )
}

export function StatusBadge({ active, activeLabel = 'Active', inactiveLabel = 'Inactive' }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: 100,
        fontSize: '0.72rem',
        fontWeight: 500,
        background: active ? 'rgba(0,255,136,0.1)' : 'rgba(255,255,255,0.05)',
        color: active ? '#00ff88' : '#6b7785',
        border: `1px solid ${active ? 'rgba(0,255,136,0.2)' : 'rgba(255,255,255,0.06)'}`,
      }}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  )
}
