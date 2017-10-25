const program = require('commander');
const didYouMean = require('didyoumean');
const isAsyncSupported = require('is-async-supported');

const pkg = require('../package.json');

const nbaGo = require('../src');
const { error, bold } = require('../utils/log');

if (!isAsyncSupported()) {
  require('async-to-gen/register');
}

program.version(pkg.version);

program
  .command('player <playerName>')
  .alias('p')
  .action(playerName => {
    nbaGo.player(playerName);
  });

program
  .command('games <date>')
  .alias('g')
  .action(date => {
    nbaGo.games(date);
  });

program.command('*').action(command => {
  error(`unknown command: ${bold(command)}`);
  const commandNames = program.commands
    .map(c => c._name)
    .filter(name => name !== '*');

  const closeMatch = didYouMean(command, commandNames);
  if (closeMatch) {
    error(`did you mean ${bold(closeMatch)}?`);
  }
  process.exit(1);
});

program.parse(process.argv);
