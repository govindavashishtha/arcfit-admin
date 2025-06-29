// Date and time utility functions for IST timezone handling
export const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Formats a date string or Date object to IST timezone
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string in IST
 */
export const formatToIST = (
  date: string | Date, 
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    ...options
  }).format(dateObj);
};

/**
 * Formats date to IST date string (DD/MM/YYYY)
 */
export const formatDateToIST = (date: string | Date): string => {
  return formatToIST(date, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formats time to IST time string (HH:MM AM/PM)
 */
export const formatTimeToIST = (date: string | Date): string => {
  return formatToIST(date, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Formats datetime to IST with both date and time
 */
export const formatDateTimeToIST = (date: string | Date): string => {
  return formatToIST(date, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Gets current IST time
 */
export const getCurrentISTTime = (): Date => {
  return new Date(new Date().toLocaleString("en-US", { timeZone: IST_TIMEZONE }));
};

/**
 * Converts UTC date to IST Date object
 */
export const convertToIST = (date: string | Date): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Date(dateObj.toLocaleString("en-US", { timeZone: IST_TIMEZONE }));
};