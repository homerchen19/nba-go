import moment from 'moment-timezone';
import getTime from 'date-fns/get_time';

import getApiDate from '../getApiDate';

const getDateByCity = city =>
  moment()
    .tz(city)
    .format();

describe('getApiDate', () => {
  // 1524281047645 = Sat Apr 21 2018 11:23:45 GMT+0800 (CST)
  // 1524196800000 = 2018-04-20T00:00:00.000-04:00

  jest.spyOn(Date, 'now').mockImplementation(() => 1524281047645);

  it('should exist', () => {
    expect(getApiDate).toBeDefined();
  });

  it('should work fine in GMT+08:00', () => {
    const date = getDateByCity('Asia/Taipei');

    expect(date).toBe('2018-04-21T11:24:07+08:00');
    expect(getApiDate(getTime(date))).toEqual({
      day: 20,
      month: 4,
      year: 2018,
    });
  });

  it('should work fine in GMT+01:00', () => {
    const date = getDateByCity('Europe/London');

    expect(date).toBe('2018-04-21T04:24:07+01:00');
    expect(getApiDate(getTime(date))).toEqual({
      day: 20,
      month: 4,
      year: 2018,
    });
  });

  it('should work fine in GMT-07:00', () => {
    const date = getDateByCity('America/Los_Angeles');

    expect(date).toBe('2018-04-20T20:24:07-07:00');
    expect(getApiDate(getTime(date))).toEqual({
      day: 20,
      month: 4,
      year: 2018,
    });
  });
});
