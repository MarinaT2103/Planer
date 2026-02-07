import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  addWeeks,
  addMonths,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  isToday,
  isTomorrow,
  isYesterday,
  differenceInDays,
  parseISO
} from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (date: Date, formatStr: string = 'dd MMMM yyyy'): string => {
  return format(date, formatStr, { locale: ru });
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm', { locale: ru });
};

export const formatRelativeDate = (date: Date): string => {
  if (isToday(date)) return 'Сегодня';
  if (isTomorrow(date)) return 'Завтра';
  if (isYesterday(date)) return 'Вчера';
  
  const diff = differenceInDays(date, new Date());
  if (diff > 0 && diff <= 7) return format(date, 'EEEE', { locale: ru });
  
  return format(date, 'd MMMM', { locale: ru });
};

export const getWeekDays = (date: Date, weekStartsOn: 0 | 1 = 1): Date[] => {
  const start = startOfWeek(date, { weekStartsOn });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const getMonthDays = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days: Date[] = [];
  
  let current = start;
  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }
  
  return days;
};

export const getMonthCalendarDays = (date: Date, weekStartsOn: 0 | 1 = 1): Date[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn });
  
  const days: Date[] = [];
  let current = calendarStart;
  
  while (current <= calendarEnd) {
    days.push(current);
    current = addDays(current, 1);
  }
  
  return days;
};

export const getYearMonths = (date: Date): Date[] => {
  const start = startOfYear(date);
  return Array.from({ length: 12 }, (_, i) => addMonths(start, i));
};

export {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  addWeeks,
  addMonths,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  isToday,
  parseISO
};
