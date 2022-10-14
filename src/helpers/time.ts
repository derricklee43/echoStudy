/**
 * Returns the absolute (floating) number of days between two dates.
 */
export function daysBetween(date1: Date, date2: Date): number {
  const dayMs = 86400000;
  const timeDiff = Math.abs(dateToUtcMs(date1) - dateToUtcMs(date2));
  return Math.floor(timeDiff / dayMs);
}

/**
 * Returns the date in UTC milliseconds.
 */
export function dateToUtcMs(date: Date): number {
  return Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  );
}

/**
 * Some date strings omit the UTC offset.
 * This adds the Zulu (Z) to imply the date string is in UTC (GMT +0000).
 */
export function asUtcDate(dateString: string): Date {
  return new Date(`${dateString}Z`);
}

/**
 * @returns returns the date formatted as MM/DD/YYYY
 */
export function getFormattedDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * @returns the time formatted as minutes:Seconds
 */
export function getFormattedMilliseconds(milliseconds: number) {
  if (milliseconds < 1000) {
    return '~0:01';
  }
  const timeInSeconds = Math.floor(milliseconds / 1000);

  const h = Math.floor(timeInSeconds / 60 / 60);
  const hours = h === 0 ? '' : h + ':';

  const minutes = Math.floor(timeInSeconds / 60) % 60;

  const s = timeInSeconds % 60;
  const seconds = s < 10 ? '0' + s : s;

  return `${hours}${minutes}:${seconds}`;
}
