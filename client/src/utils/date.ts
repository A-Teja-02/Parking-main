/**
 * Date utility functions.
 * All business date logic is centralized here for easy API adaptation.
 */

/**
 * Returns tomorrow's date as ISO string (YYYY-MM-DD).
 */
export function getTomorrowDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

/**
 * Returns true if today is Friday or Saturday (when reservations are closed).
 */
export function isWeekendToday(): boolean {
  const day = new Date().getDay();
  return day === 5 || day === 6;
}

/**
 * Formats a date string (YYYY-MM-DD) to a human-readable form.
 * e.g. "Thursday, 3 July 2026"
 */
export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Returns today's day name.
 */
export function getTodayDayName(): string {
  return new Date().toLocaleDateString('en-IN', { weekday: 'long' });
}

/**
 * Returns the name of the day for tomorrow.
 */
export function getTomorrowDayName(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString('en-IN', { weekday: 'long' });
}

/**
 * Returns seconds remaining until midnight tonight (reservation window close).
 */
export function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(23, 59, 59, 999);
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
}

/**
 * Formats seconds into HH:MM:SS string.
 */
export function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}
