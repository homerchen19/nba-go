import chalk from 'chalk';

const print = msg => {
  console.log(chalk`{green ${msg}}`);
};

const warn = msg => {
  console.log(chalk`{yellow ${msg}}`);
};

const error = msg => {
  console.log(chalk`{red.bold ${msg}}`);
};

const bold = msg => chalk`{white.bold ${msg}}`;

const neonGreen = msg => chalk`{hex('#66ff66') ${msg}}`;

const colorTeamName = (color, name) =>
  chalk`{bold.white.bgHex('${color}') ${name}}`;

export { print, warn, error, bold, neonGreen, colorTeamName };
