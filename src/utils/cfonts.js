import CFonts from 'cfonts';
import format from 'date-fns/format';
import { getColorsList } from 'nba-color';

const supportedColorMapping = color => {
  const unsupportedColors = {
    silver: 'gray',
    purple: 'magenta',
    teal: 'cyan',
    wine: 'red',
    navy: 'blue',
    gold: 'yellow',
    cream: 'yellow',
    orange: 'yellow',
    midnightBlue: 'blue',
    bealeStreetBlue: 'blue',
    smokeBlue: 'blue',
    darkBlue: 'blue',
    black: 'white',
  };

  return unsupportedColors[color] ? unsupportedColors[color] : color;
};

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

const cfontsGameTitle = team => {
  const teamColorsList = getColorsList(team.getAbbreviation());

  CFonts.say(`${team.getName()} : ${team.getScore()}`, {
    font: 'block',
    align: 'left',
    colors: [
      supportedColorMapping(teamColorsList[0]),
      supportedColorMapping(teamColorsList[1]),
    ],
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
  });
};

module.exports = {
  cfontsDate,
  cfontsGameTitle,
};
