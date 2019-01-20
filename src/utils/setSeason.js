import R from 'ramda';
import parse from 'date-fns/parse';
import getMonth from 'date-fns/get_month';
import getYear from 'date-fns/get_year';
import emoji from 'node-emoji';

import { error } from './log';

const setSeason = date => {
  const year = R.compose(
    getYear,
    parse
  )(date);
  const month = R.compose(
    getMonth,
    parse
  )(date);

  if (year < 2012 || (year === 2012 && month < 5)) {
    error(
      `Sorry, https://stats.nba.com/ doesn't provide season data before 2012-13 ${emoji.get(
        'confused'
      )}`
    );

    process.exit(1);
  }

  if (month > 9) {
    process.env.season = `${year}-${(year + 1).toString().slice(-2)}`;
  } else {
    process.env.season = `${year - 1}-${year.toString().slice(-2)}`;
  }

  return date;
};

export default setSeason;
