import catchAPIError from '../catchAPIError';
import { error } from '../log';

jest.mock('../log');
process.exit = jest.fn();

describe('catchAPIError', () => {
  it('should exist', () => {
    expect(catchAPIError).toBeDefined();
  });

  it('should work', () => {
    catchAPIError('error message', 'NBA.getGamesFromDate()');

    expect(error).toBeCalledWith('error message');
    expect(process.exit).toBeCalledWith(1);
  });
});
