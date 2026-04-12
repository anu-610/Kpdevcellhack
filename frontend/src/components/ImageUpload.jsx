import { useRef, useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadFile } from '../lib/api'

/**
 * ImageUpload — drag-and-drop / click file picker that uploads directly
 * to Supabase Storage and returns the public URL via onUpload(url).
 *
 * Props:
 *   bucket      — Supabase storage bucket name (e.g. "avatars")
 *   currentUrl  — existing image URL to show as preview
 *   onUpload    — callback(url: string) called after successful upload
 *   label       — field label text
 *   maxSize     — max file size in MB (default 4)
 *   helperText  — small hint below the dropzone
 *   accept      — accepted MIME types string (default "image/*")
 *   pathPrefix  — prefix for the storage path (default uses bucket name)
 */
export default function ImageUpload({
  bucket = 'avatars',
  currentUrl = '',
  onUpload,
  label = 'Upload Image',
  maxSize = 4,
  helperText = '',
  accept = 'image/*',
  pathPrefix = '',
}) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(currentUrl || '')
  const [dragOver, setDragOver] = useState(false)

  async function handleFile(file) {
    if (!file) return
    setError('')

    // Validate type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.')
      return
    }

    // Validate size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File too large. Max size is ${maxSize}MB.`)
      return
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setUploading(true)

    // Build storage path: prefix/timestamp-filename
    const ext = file.name.split('.').pop()
    const prefix = pathPrefix || bucket
    const path = `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { url, error: uploadError } = await uploadFile(bucket, file, path)

    setUploading(false)

    if (uploadError) {
      setError(uploadError.message || 'Upload failed. Check Supabase storage policies.')
      setPreview(currentUrl || '')
      return
    }

    setPreview(url)
    onUpload(url)
  }

  function onInputChange(e) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  function onDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function clearPreview() {
    setPreview('')
    onUpload('')
    setError('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: '0.8rem', color: '#8a9aaa', fontWeight: 500 }}>
          {label}
        </label>
      )}

      {/* Dropzone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: preview ? 120 : 88,
          border: `1.5px dashed ${dragOver ? '#00ff88' : error ? '#ff6b6b44' : '#1e2c3d'}`,
          borderRadius: 10,
          background: dragOver ? '#00ff8808' : '#111922',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          overflow: 'hidden',
          transition: 'border-color 0.15s, background 0.15s',
        }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }}
              onError={() => setPreview('')}
            />
            {/* Overlay on hover */}
            <div
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 6, opacity: 0, transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
            >
              <Upload size={18} color="#fff" />
              <span style={{ fontSize: '0.75rem', color: '#fff' }}>
                {uploading ? 'Uploading…' : 'Click to replace'}
              </span>
            </div>
            {/* Clear button */}
            {!uploading && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); clearPreview() }}
                style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 24, height: 24, borderRadius: '50%',
                  background: 'rgba(0,0,0,0.7)', border: '1px solid #333',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', zIndex: 10,
                }}
              >
                <X size={12} color="#fff" />
              </button>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '16px 12px' }}>
            {uploading ? (
              <>
                <Loader2 size={22} color="#00ff88" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: '0.78rem', color: '#6b7785' }}>Uploading…</span>
              </>
            ) : (
              <>
                <Upload size={22} color="#444f5e" />
                <span style={{ fontSize: '0.78rem', color: '#6b7785', textAlign: 'center' }}>
                  Click or drag to upload
                  <br />
                  <span style={{ fontSize: '0.72rem', color: '#3a4450' }}>
                    Max {maxSize}MB · {accept === 'image/*' ? 'PNG, JPG, WEBP, GIF' : accept}
                  </span>
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {helperText && !error && (
        <span style={{ fontSize: '0.72rem', color: '#4a5568' }}>{helperText}</span>
      )}

      {error && (
        <span style={{ fontSize: '0.72rem', color: '#ff6b6b' }}>⚠ {error}</span>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onInputChange}
        style={{ display: 'none' }}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}