import { supabase } from '../lib/supabase'

const CACHE_PREFIX = 'rh_setting_'

export async function getSetting(key) {
  // 1. Try local storage cache first for instant response
  let cachedValue = null
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`)
    if (raw) {
      cachedValue = JSON.parse(raw)
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
      // Sync cache
      try {
        localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(data.value))
      } catch (e) {}
      return data.value
    }
  } catch (err) {
    console.warn(`[getSetting] Supabase error for ${key}:`, err)
  }

  // 3. Return cached value if Supabase is null or failed
  return cachedValue
}

export async function setSetting(key, value) {
  // 1. Always save to LocalStorage immediately for instant offline/online UI sync
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(value))
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
        { key, value, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
    if (error) {
      console.warn('[setSetting] Supabase upsert error (using localStorage fallback):', error.message)
    }
  } catch (err) {
    console.warn('[setSetting] Supabase failed, saved to localStorage:', err)
  }
}
