import { cfontsDate } from '../cfonts';

jest.mock('cfonts');

const CFonts = require('cfonts');

describe('cfonts', () => {
  it('should call Cfonts.say and format date', () => {
    cfontsDate('2017-11-11');

    expect(CFonts.say).toBeCalledWith('2017/11/11', {
      font: 'block',
      align: 'left',
      colors: ['blue', 'red'],
      background: 'black',
      letterSpacing: 1,
      lineHeight: 1,
      space: true,
      maxLength: '10',
    });
  });
});
