import CFonts from 'cfonts';
import format from 'date-fns/format';

const cfontsDate = date => {
  CFonts.say(format(date, 'YYYY/MM/DD'), {
    font: 'block',
    align: 'left',
    colors: ['blue', 'red'],
    background: 'black',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '10',
  });
};

module.exports = {
  cfontsDate,
};
