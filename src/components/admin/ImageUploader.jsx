import { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const ACCENT = "#C5963A"
const CARD_BORDER = "rgba(8,43,73,0.12)"
const TEXT_SECONDARY = "#765334"
const TEXT_MUTED = "#9A8870"
const TEXT_PRIMARY = "#292725"

export default function ImageUploader({ 
  value, 
  onChange, 
  label = "Image", 
  bucket = "product-images",
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  showPreview = true 
}) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || null)
  const fileRef = useRef(null)

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize) {
      toast.error(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('Please select an image or video file')
      return
    }

    setUploading(true)

    try {
      // Generate unique filename
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`
      const filePath = `uploads/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          contentType: file.type,
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

      const publicUrl = urlData.publicUrl

      // Set preview and call onChange
      setPreview(publicUrl)
      onChange(publicUrl)
      toast.success('Image uploaded successfully!')

    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  const handleUrlChange = (url) => {
    setPreview(url)
    onChange(url)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {showPreview && preview && (
        <div style={{ position: 'relative', marginBottom: 8 }}>
          <img 
            src={preview} 
            alt="Preview" 
            style={{ 
              width: '100%', 
              maxHeight: 200, 
              objectFit: 'cover', 
              borderRadius: 8, 
              border: `2px solid ${CARD_BORDER}` 
            }} 
            onError={(e) => {
              e.target.style.display = 'none'
              toast.error('Failed to load image preview')
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            style={{ 
              position: 'absolute', 
              top: 8, 
              right: 8, 
              background: 'rgba(0,0,0,0.7)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '50%', 
              width: 32, 
              height: 32, 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.9)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {!preview && (
        <div
          onClick={() => fileRef.current?.click()}
          style={{ 
            border: `2px dashed ${CARD_BORDER}`, 
            borderRadius: 8, 
            padding: 32, 
            textAlign: 'center', 
            cursor: uploading ? 'not-allowed' : 'pointer',
            background: 'rgba(8,43,73,0.02)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            if (!uploading) {
              e.currentTarget.style.borderColor = ACCENT
              e.currentTarget.style.background = 'rgba(197,150,58,0.05)'
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = CARD_BORDER
            e.currentTarget.style.background = 'rgba(8,43,73,0.02)'
          }}
        >
          {uploading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexDirection: 'column' }}>
              <Loader2 size={32} className="animate-spin" style={{ color: ACCENT }} />
              <span style={{ color: TEXT_SECONDARY, fontSize: '0.875rem', fontWeight: 500 }}>Uploading...</span>
            </div>
          ) : (
            <>
              <ImageIcon size={40} style={{ color: TEXT_MUTED, margin: '0 auto 12px', opacity: 0.6 }} strokeWidth={1.5} />
              <p style={{ color: TEXT_PRIMARY, fontSize: '0.9375rem', fontWeight: 600, marginBottom: 4 }}>
                Click to upload {label.toLowerCase()}
              </p>
              <p style={{ color: TEXT_MUTED, fontSize: '0.8125rem' }}>
                JPG, PNG, WEBP, GIF · Max {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </>
          )}
        </div>
      )}

      <input 
        ref={fileRef} 
        type="file" 
        accept={accept} 
        style={{ display: 'none' }} 
        onChange={handleFileSelect}
        disabled={uploading}
      />

      {/* URL Input as alternative */}
      <div>
        <label style={{ 
          display: 'block', 
          color: TEXT_SECONDARY, 
          fontSize: '0.75rem', 
          fontWeight: 600, 
          marginBottom: 6,
          fontFamily: "'Inter', sans-serif"
        }}>
          Or paste {label.toLowerCase()} URL
        </label>
        <input 
          type="url"
          value={preview || ''} 
          onChange={(e) => handleUrlChange(e.target.value)} 
          placeholder="https://..."
          disabled={uploading}
          style={{
            width: '100%',
            background: '#FFFFFF',
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 6,
            padding: '10px 14px',
            color: TEXT_PRIMARY,
            fontSize: '0.875rem',
            fontFamily: "'Inter', sans-serif",
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s'
          }}
          onFocus={e => {
            e.target.style.borderColor = ACCENT
            e.target.style.boxShadow = '0 0 0 3px rgba(197,150,58,0.1)'
          }}
          onBlur={e => {
            e.target.style.borderColor = CARD_BORDER
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}
