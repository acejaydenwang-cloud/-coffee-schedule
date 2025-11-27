/**
 * Converts "HH:mm" string to minutes from start of day (0-1439)
 */
export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Converts minutes from start of day to "HH:mm"
 */
export const minutesToTime = (minutes: number): string => {
  // Normalize to 0-1439 (24 hours)
  let m = minutes % 1440;
  if (m < 0) m += 1440;

  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
};

/**
 * Returns a human readable formatted time (e.g., "7:30 AM")
 */
export const formatTimeDisplay = (minutes: number): string => {
  let m = minutes % 1440;
  if (m < 0) m += 1440;

  const h = Math.floor(m / 60);
  const min = m % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  
  return `${displayH}:${min.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Calculates duration string between two minute points
 */
export const formatDuration = (start: number, end: number): string => {
    let diff = end - start;
    if (diff < 0) diff += 1440;
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
};