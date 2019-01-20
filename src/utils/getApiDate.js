import startOfDay from 'date-fns/start_of_day';
import { DateTime } from 'luxon';

export default function(date) {
  const targetDate = DateTime.fromJSDate(startOfDay(date), {
    zone: 'America/New_York',
  }).startOf('day');

  return {
    year: targetDate.year,
    month: targetDate.month,
    day: targetDate.day,
  };
}
