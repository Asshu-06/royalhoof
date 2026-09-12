/**
 * Validation utilities for phone numbers and email addresses.
 */

/**
 * Validates a mobile phone number.
 * Accepts a 10-digit Indian mobile number starting with 6, 7, 8, or 9
 * (optionally prefixed with +91 or 91).
 * 
 * @param {string} phone 
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  if (!phone || typeof phone !== 'string') return false
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  return /^(?:\+91|91)?[6-9]\d{9}$/.test(cleanPhone)
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
