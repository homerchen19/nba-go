import chalk from 'chalk';

export const error = msg => {
  console.log(chalk`{red.bold ${msg}}`);
};

export const bold = msg => chalk`{white.bold ${msg}}`;

export const nbaRed = msg => chalk`{bold.hex('#f00b47') ${msg}}`;

export const neonGreen = msg => chalk`{hex('#66ff66') ${msg}}`;

export const colorTeamName = (color, name) =>
  chalk`{bold.white.bgHex('${color}') ${name}}`;
