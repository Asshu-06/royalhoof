import { useState, useRef, useEffect } from 'react'
import { Upload, X, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const ACCENT = "#C5963A"
const CARD_BORDER = "rgba(12, 13, 17,0.12)"
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
  const [hasError, setHasError] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    setPreview(value || null)
    setHasError(false)
  }, [value])

  const compressImageFile = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.78) => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = () => resolve('')
        reader.readAsDataURL(file)
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          let width = img.width
          let height = img.height

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width)
              width = maxWidth
            } else {
              width = Math.round((width * maxHeight) / height)
              height = maxHeight
            }
          }

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
          resolve(compressedDataUrl)
        }
        img.onerror = () => resolve(event.target.result)
      }
      reader.onerror = () => resolve('')
      reader.readAsDataURL(file)
    })
  }

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
    setHasError(false)

    try {
      // Create lightweight compressed Data URL
      const compressedDataUrl = await compressImageFile(file)

      // Try uploading to Supabase Storage
      try {
        const ext = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`
        const filePath = `uploads/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            contentType: file.type,
            upsert: true
          })

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath)

          if (urlData?.publicUrl) {
            setPreview(urlData.publicUrl)
            onChange(urlData.publicUrl)
            toast.success('Image uploaded successfully!')
            return
          }
        }
      } catch (storageErr) {
        console.warn('Supabase storage upload failed, using local Data URL fallback:', storageErr)
      }

      // Fallback to compressed Data URL if Supabase bucket fails or returns error
      setPreview(compressedDataUrl)
      onChange(compressedDataUrl)
      toast.success('Image processed successfully!')

    } catch (error) {
      console.error('File selection error:', error)
      toast.error('Failed to process image file')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setHasError(false)
    onChange('')
    if (fileRef.current) {
      fileRef.current.value = ''
    }
  }

  const handleUrlChange = (url) => {
    const trimmed = (url || '').trim()
    setPreview(trimmed || null)
    setHasError(false)
    onChange(trimmed)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {showPreview && preview && (
        <div style={{ position: 'relative', marginBottom: 8 }}>
          {!hasError ? (
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
              onError={() => {
                setHasError(true)
              }}
            />
          ) : (
            <div style={{ 
              padding: 24, 
              borderRadius: 8, 
              border: `2px dashed #ef4444`, 
              background: '#fef2f2',
              color: '#991b1b',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6
            }}>
              <AlertCircle size={24} style={{ color: '#ef4444' }} />
              <p style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Invalid or Broken Image Link</p>
              <p style={{ fontSize: '0.75rem', color: '#b91c1c' }}>Please paste a direct image URL (ending in .jpg, .png, etc.)</p>
            </div>
          )}
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
              transition: 'all 0.2s',
              zIndex: 10
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
            padding: 28, 
            textAlign: 'center', 
            cursor: uploading ? 'not-allowed' : 'pointer',
            background: 'rgba(12, 13, 17,0.02)',
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
            e.currentTarget.style.background = 'rgba(12, 13, 17,0.02)'
          }}
        >
          {uploading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexDirection: 'column' }}>
              <Loader2 size={32} className="animate-spin" style={{ color: ACCENT }} />
              <span style={{ color: TEXT_SECONDARY, fontSize: '0.875rem', fontWeight: 500 }}>Uploading...</span>
            </div>
          ) : (
            <>
              <ImageIcon size={36} style={{ color: TEXT_MUTED, margin: '0 auto 10px', opacity: 0.6 }} strokeWidth={1.5} />
              <p style={{ color: TEXT_PRIMARY, fontSize: '0.875rem', fontWeight: 600, marginBottom: 4 }}>
                Click to upload {label.toLowerCase()}
              </p>
              <p style={{ color: TEXT_MUTED, fontSize: '0.75rem' }}>
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
