const STORAGE_KEY = 'tinytrend_whatsapp'
const DEFAULT_NUMBER = '917904072714'

export function getWhatsAppNumber(): string {
  if (typeof window === 'undefined') return DEFAULT_NUMBER
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_NUMBER
}

export function setWhatsAppNumber(number: string) {
  const cleaned = number.replace(/[\s\-\+\(\)]/g, '')
  localStorage.setItem(STORAGE_KEY, cleaned)
}
