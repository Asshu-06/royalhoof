import { supabase } from '../lib/supabase'

const CACHE_PREFIX = 'rh_setting_'

/**
 * Fully parse a raw value from localStorage or Supabase.
 * Handles double-stringified JSON (string containing a JSON string) by
 * repeatedly parsing until a non-string value or a non-JSON string is reached.
 */
function fullyParse(raw) {
  if (raw === null || raw === undefined) return null

  // Replace known bad characters first
  if (typeof raw === 'string') {
    raw = raw.replace(/\uFFFD/g, '-')
  }

  // If it's already an object/array, just clean and return
  if (typeof raw !== 'string') return cleanObj(raw)

  // Try to parse – if it's not valid JSON, return as-is
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    return raw
  }

  // If the result is still a string, it was double-stringified – parse again
  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed)
    } catch {
      // Not JSON – just a plain string value
    }
  }

  return cleanObj(parsed)
}

function cleanObj(obj) {
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

export async function getSetting(key) {
  // 1. Try localStorage cache for an instant response while Supabase fetches
  let cachedValue = null
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`)
    if (raw !== null) {
      cachedValue = fullyParse(raw)
    }
  } catch (e) {
    console.warn(`[getSetting] LocalStorage parse error for ${key}:`, e)
  }

  // 2. Fetch fresh value from Supabase
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle()

    if (!error && data?.value !== undefined && data?.value !== null) {
      const parsed = fullyParse(data.value)

      // Update cache with the fresh value
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

  // 3. Fall back to cached value if Supabase failed or returned nothing
  return cachedValue
}

export async function setSetting(key, value) {
  // Always store as a plain parsed value – never double-stringify
  let parsedValue = value
  if (typeof value === 'string') {
    try {
      parsedValue = JSON.parse(value)
    } catch {
      // Keep as string if it's not JSON
    }
  }

  const stringifiedValue = JSON.stringify(parsedValue)

  // 1. Write to localStorage immediately for instant same-session UI sync
  try {
    localStorage.setItem(`${CACHE_PREFIX}${key}`, stringifiedValue)
    // Dispatch custom event so any listening component updates immediately
    window.dispatchEvent(new CustomEvent('site_settings_updated', { detail: { key, value: parsedValue } }))
  } catch (e) {
    console.warn(`[setSetting] LocalStorage write error for ${key}:`, e)
  }

  // 2. Persist to Supabase
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
