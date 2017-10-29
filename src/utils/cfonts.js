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
  };

  return unsupportedColors[color] ? unsupportedColors[color] : color;
};

const cfontsTeamName = (name, score, fontColor, backgroundColor) => {
  CFonts.say(`${name}`, {
    font: 'block',
    align: 'center',
    colors: [
      supportedColorMapping(fontColor),
      supportedColorMapping(backgroundColor),
    ],
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
  });
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

const cfontsGameTitle = (homeTeam, visitorTeam) => {
  const homeTeamColorsList = getColorsList(homeTeam.getAbbreviation());
  const visitorTeamColorsList = getColorsList(visitorTeam.getAbbreviation());

  cfontsTeamName(
    homeTeam.getName(),
    homeTeam.getScore(),
    homeTeamColorsList[0],
    homeTeamColorsList[1]
  );

  CFonts.say('v.s.', {
    font: 'simple',
    align: 'center',
    colors: ['white'],
    background: 'black',
    letterSpacing: 1,
    lineHeight: 1,
    space: false,
    maxLength: '0',
  });

  cfontsTeamName(
    visitorTeam.getName(),
    visitorTeam.getScore(),
    visitorTeamColorsList[0],
    visitorTeamColorsList[1]
  );
};

module.exports = {
  cfontsDate,
  cfontsGameTitle,
};
