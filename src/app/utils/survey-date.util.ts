import { MILLISECONDS_PER_DAY } from '../models/survey.constants';
import { Survey } from '../models/survey.model';

/** Returns true if the survey has an end date that lies in the past. */
export function isPastSurvey(survey: Survey, now: number = Date.now()): boolean {
  return survey.endDate !== null && survey.endDate <= now;
}

/** Returns true if the survey ends within the given number of days. */
export function endsWithinDays(survey: Survey, days: number, now: number = Date.now()): boolean {
  if (survey.endDate === null || isPastSurvey(survey, now)) {
    return false;
  }
  return survey.endDate - now <= days * MILLISECONDS_PER_DAY;
}

/** Sorts surveys by end date, earliest first. Surveys without end date go last. */
export function sortByEndDate(surveys: Survey[]): Survey[] {
  const toKey = (survey: Survey): number => survey.endDate ?? Number.MAX_SAFE_INTEGER;
  return [...surveys].sort((first, second) => toKey(first) - toKey(second));
}

/** Builds the deadline label, e.g. "Ends in 2 Days" or "Ended 01.09.2025". */
export function formatDeadline(survey: Survey, now: number = Date.now()): string {
  if (survey.endDate === null) {
    return 'No deadline';
  }
  if (isPastSurvey(survey, now)) {
    return `Ended ${formatDate(survey.endDate)}`;
  }
  const days = Math.max(1, Math.ceil((survey.endDate - now) / MILLISECONDS_PER_DAY));
  return `Ends in ${days} ${days === 1 ? 'Day' : 'Days'}`;
}

/** Formats epoch milliseconds as dd.MM.yyyy. */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
