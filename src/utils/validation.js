/**
 * Validation utilities for phone numbers and email addresses.
 */

/**
 * Validates a mobile phone number.
 * Must be exactly 10 digits, containing only numbers (0-9) and starting with 6, 7, 8, or 9.
 * 
 * @param {string} phone 
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false
  const cleanPhone = phone.trim()
  return /^[6-9]\d{9}$/.test(cleanPhone)
}

/**
 * Sanitizes phone input by stripping all non-digit characters and limiting length to 10.
 * @param {string} value 
 * @returns {string}
 */
export function sanitizePhone(value) {
  if (!value) return ''
  return String(value).replace(/\D/g, '').slice(0, 10)
}

/**
 * Validates an email address format.
 * 
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}
