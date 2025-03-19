import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to the format shown in the UI
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  // Format: "4 Jan, 2025" as shown in the UI
  return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}, ${date.getFullYear()}`;
}

/**
 * Extracts initials from a name (first letter of first and last name)
 */
export function getInitials(name: string): string {
  if (!name) return '';
  
  const names = name.split(' ');
  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  }
  
  return (names[0][0] + names[names.length - 1][0]).toUpperCase();
}

/**
 * Gets the appropriate CSS class for a stage indicator
 */
export function getStageClass(stage: string): string {
  switch (stage) {
    case 'I':
      return 'bg-purple-100 text-purple-600';
    case 'II':
      return 'bg-blue-100 text-blue-600';
    case 'III':
      return 'bg-slate-100 text-slate-600';
    case 'IIII':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

/**
 * Truncates text to a specific length and adds an ellipsis
 */
export function truncateText(text: string, maxLength: number = 30): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Generates a random ID for temporary use
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Creates the ranges for pagination display
 */
export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  maxDisplayed: number = 7
): (number | string)[] {
  // If we have fewer pages than the max, just return all page numbers
  if (totalPages <= maxDisplayed) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Calculate the range to display
  let rangeStart = Math.max(currentPage - Math.floor(maxDisplayed / 2), 1);
  let rangeEnd = rangeStart + maxDisplayed - 1;

  // Adjust if we're near the end
  if (rangeEnd > totalPages) {
    rangeEnd = totalPages;
    rangeStart = Math.max(totalPages - maxDisplayed + 1, 1);
  }

  // Build the range array
  const range: (number | string)[] = [];
  
  // Add first page and ellipsis if needed
  if (rangeStart > 1) {
    range.push(1);
    if (rangeStart > 2) {
      range.push('...');
    }
  }
  
  // Add the main range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    range.push(i);
  }
  
  // Add ellipsis and last page if needed
  if (rangeEnd < totalPages) {
    if (rangeEnd < totalPages - 1) {
      range.push('...');
    }
    range.push(totalPages);
  }
  
  return range;
}

export const isBrowser = () => typeof window !== 'undefined';

export function setToken(token: string) {
  if (isBrowser()) {
    localStorage.setItem('token', token);
    document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Strict; ${location.protocol === 'https:' ? 'Secure;' : ''}`;
  }
}

export function getToken() {
  if (isBrowser()) {
    return localStorage.getItem('token') || document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  }
  return null;
}

export function removeToken() {
  if (isBrowser()) {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; max-age=0; SameSite=Strict;';
  }
}