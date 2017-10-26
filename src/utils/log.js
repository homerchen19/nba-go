import chalk from 'chalk';

const print = msg => {
  console.log(chalk.green(`${msg}`));
};

const warn = msg => {
  console.log(chalk.yellow(`${msg}`));
};

const error = msg => {
  console.log(chalk.bold.red(`${msg}`));
};

const bold = msg => chalk.bold(msg);

export { print, warn, error, bold };
