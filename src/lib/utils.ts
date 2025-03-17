import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'BRL',
  options: Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    ...options,
  }).format(amount)
}

/**
 * Extracts date components from ISO date string
 */
export function extractDateComponents(isoDateString: string) {
  const date = new Date(isoDateString)
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    formattedDate: date.toLocaleDateString('pt-BR'),
    formattedTime: date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}

/**
 * Truncates text to a specific length
 */
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
