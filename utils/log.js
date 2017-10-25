const chalk = require('chalk');

function print(msg) {
  console.log(chalk.green(`${msg}`));
}

function warn(msg) {
  console.log(chalk.yellow(`${msg}`));
}

function error(msg) {
  console.log(chalk.bold.red(`${msg}`));
}

function bold(msg) {
  return chalk.bold(msg);
}

module.exports = { print, warn, error, bold };
