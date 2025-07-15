import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

export const formatDateTime = (date: Date, language: 'pt' | 'en' = 'pt'): string => {
  const locale = language === 'pt' ? ptBR : enUS;
  return format(date, 'dd/MM/yyyy HH:mm:ss', { locale });
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm:ss');
};

export const formatDuration = (seconds: number, language: 'pt' | 'en' = 'pt'): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (language === 'pt') {
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  } else {
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }
};

export const formatRelativeTime = (date: Date, language: 'pt' | 'en' = 'pt'): string => {
  const locale = language === 'pt' ? ptBR : enUS;
  return formatDistanceToNow(date, { addSuffix: true, locale });
};

export const getDurationBetweenDates = (startDate: Date, endDate: Date): number => {
  return differenceInSeconds(endDate, startDate);
};

export const addSecondsToDate = (date: Date, seconds: number): Date => {
  return new Date(date.getTime() + seconds * 1000);
};