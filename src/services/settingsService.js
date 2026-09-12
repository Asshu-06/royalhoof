import { supabase } from '../lib/supabase'

const CACHE_PREFIX = 'rh_setting_'

export async function getSetting(key) {
  // 1. Try local storage cache first for instant response
  let cachedValue = null
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`)
    if (raw) {
      cachedValue = JSON.parse(raw.replace(/\uFFFD/g, '-'))
    }
  } catch (e) {
    console.warn(`[getSetting] LocalStorage parse error for ${key}:`, e)
  }

  // 2. Fetch from Supabase site_settings
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle()

    if (!error && data?.value !== undefined && data?.value !== null) {
      let parsed = data.value
      if (typeof parsed === 'string') {
        parsed = parsed.replace(/\uFFFD/g, '-')
        try {
          parsed = JSON.parse(parsed)
        } catch (e) {
          // Keep raw string if it is not valid JSON
        }
      }

      // Recursively clean replacement characters from loaded settings
      const cleanObj = (obj) => {
        if (typeof obj === 'string') return obj.replace(/\uFFFD/g, '-')
        if (Array.isArray(obj)) return obj.map(cleanObj)
        if (typeof obj === 'object' && obj !== null) {
          const res = {}
          for (const k in obj) {
            res[k] = cleanObj(obj[k])
          }
          return res
        }
        return obj
      }
      parsed = cleanObj(parsed)

      // Sync cache
      try {
        localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(parsed))
      } catch (e) {
        console.warn(`[getSetting] LocalStorage sync warning for ${key}:`, e)
      }
      return parsed
    }
  } catch (err) {
    console.warn(`[getSetting] Supabase error for ${key}:`, err)
  }

  // 3. Return cached value if Supabase is null or failed
  return cachedValue
}

export async function setSetting(key, value) {
  const stringifiedValue = typeof value === 'string' ? value : JSON.stringify(value)

  // 1. Always save to LocalStorage immediately for instant offline/online UI sync
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, stringifiedValue)
    // Dispatch custom event for real-time UI updates across components/tabs
    window.dispatchEvent(new CustomEvent('site_settings_updated', { detail: { key, value } }))
  } catch (e) {
    console.warn(`[setSetting] LocalStorage write error for ${key}:`, e)
  }

  // 2. Upsert to Supabase site_settings table
  try {
    const { error } = await supabase
      .from('site_settings')
      .upsert(
        { key, value: stringifiedValue, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
    if (error) {
      console.warn('[setSetting] Supabase upsert error (using localStorage fallback):', error.message)
    }
  } catch (err) {
    console.warn('[setSetting] Supabase failed, saved to localStorage:', err)
  }
}
