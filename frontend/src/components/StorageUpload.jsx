import { useEffect, useRef, useState } from 'react'
import { ExternalLink, FileText, Loader2, Upload, X, File } from 'lucide-react'
import { uploadFile } from '../lib/api'

function matchesAccept(file, accept) {
  if (!accept || accept === '*/*') return true
  return accept.split(',').map(r => r.trim()).filter(Boolean).some(rule => {
    if (rule.endsWith('/*')) return file.type.startsWith(rule.slice(0, -1))
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule.toLowerCase())
    return file.type === rule
  })
}

function looksLikeImage(url = '') {
  return /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(url)
}

function looksLikePdf(url = '') {
  return /\.pdf$/i.test(url) || url.includes('pdf')
}

function getFileName(url = '', fallback = 'Uploaded file') {
  try {
    const pathname = new URL(url).pathname
    return decodeURIComponent(pathname.split('/').pop() || fallback)
  } catch { return fallback }
}

export default function StorageUpload({
  bucket = 'avatars',
  pathPrefix = '',
  currentUrl = '',
  onUpload,
  label = 'Upload File',
  accept = '*/*',
  maxSize = 10,
  className = '',
  fileTypeLabel = 'file',
  helperText = '',
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState(currentUrl)
  const fileRef = useRef(null)

  useEffect(() => { setPreviewUrl(currentUrl) }, [currentUrl])

  const isImage = looksLikeImage(previewUrl)
  const isPdf = looksLikePdf(previewUrl)

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    if (file.size > maxSize * 1024 * 1024) { setError(`File too large. Max ${maxSize}MB allowed.`); return }
    if (!matchesAccept(file, accept)) { setError(`Only ${fileTypeLabel} uploads are allowed.`); return }

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const prefix = pathPrefix || bucket
      const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { url, error: uploadError } = await uploadFile(bucket, file, path)
      if (uploadError) throw uploadError

      setPreviewUrl(url)
      onUpload?.(url)
    } catch (err) {
      console.error('Upload error:', err)
      setError(err?.message || `Failed to upload ${fileTypeLabel}.`)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function handleRemove() {
    setPreviewUrl(''); setError(''); onUpload?.('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: '0.8rem', color: '#8a9aaa', fontWeight: 500 }}>{label}</label>
      )}

      {previewUrl ? (
        isImage ? (
          /* Image preview */
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img src={previewUrl} alt="Preview" style={{ height: 110, width: '100%', objectFit: 'cover', borderRadius: 10, border: '1px solid #253041', display: 'block' }} onError={() => setPreviewUrl('')} />
            <button type="button" onClick={handleRemove} style={{ position: 'absolute', top: -8, right: -8, width: 24, height: 24, borderRadius: '50%', background: '#ff4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={13} color="#fff" />
            </button>
          </div>
        ) : (
          /* PDF / generic file preview */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '12px 14px', background: '#0f1820', border: '1px solid #1e2c3d', borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: 'rgba(87,162,255,0.1)', border: '1px solid rgba(87,162,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {isPdf ? <FileText size={18} color="#57a2ff" /> : <File size={18} color="#57a2ff" />}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                  {getFileName(previewUrl, `Uploaded ${fileTypeLabel}`)}
                </p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#6b7785' }}>
                  {isPdf ? 'PDF document' : fileTypeLabel} · uploaded
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{ width: 32, height: 32, borderRadius: 7, border: '1px solid #1e2a38', background: '#131922', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7a8694', textDecoration: 'none' }}>
                <ExternalLink size={14} />
              </a>
              <button type="button" onClick={handleRemove} style={{ width: 32, height: 32, borderRadius: 7, border: '1px solid #3d1820', background: '#211317', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff7b8b' }}>
                <X size={14} />
              </button>
            </div>
          </div>
        )
      ) : (
        /* Drop zone */
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 8, height: 90, width: '100%',
            border: '1.5px dashed #1e2c3d', borderRadius: 10, background: '#111922',
            cursor: uploading ? 'not-allowed' : 'pointer', transition: 'border-color 0.15s',
          }}
          onMouseEnter={(e) => { if (!uploading) e.currentTarget.style.borderColor = '#00ff8866' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1e2c3d' }}
        >
          {uploading ? (
            <>
              <Loader2 size={22} color="#00ff88" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '0.78rem', color: '#6b7785' }}>Uploading…</span>
            </>
          ) : (
            <>
              <Upload size={22} color="#3a4858" />
              <span style={{ fontSize: '0.78rem', color: '#6b7785', textAlign: 'center' }}>
                Click to upload {fileTypeLabel}
                <br />
                <span style={{ fontSize: '0.72rem', color: '#3a4450' }}>Max {maxSize}MB</span>
              </span>
            </>
          )}
        </div>
      )}

      {helperText && !error && (
        <span style={{ fontSize: '0.72rem', color: '#4a5568' }}>{helperText}</span>
      )}
      {error && (
        <span style={{ fontSize: '0.72rem', color: '#ff6b6b' }}>⚠ {error}</span>
      )}

      <input ref={fileRef} type="file" accept={accept} onChange={handleFileChange} style={{ display: 'none' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}