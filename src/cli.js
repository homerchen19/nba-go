import program from 'commander';
import didYouMean from 'didyoumean';
import isAsyncSupported from 'is-async-supported';

import pkg from '../package.json';

import nbaGo from './command';
import { error, bold } from './utils/log';

if (!isAsyncSupported()) {
  require('async-to-gen/register');
}

program.version(pkg.version);

program
  .command('player <playerName>')
  .alias('p')
  .option('-i, --info', "Check the player's basic iniformation")
  .option('-r, --regular', "Check the player's career regular season data")
  .option('-p, --playoffs', "Check the player's career playoffs data")
  .action((playerName, option) => {
    nbaGo.player(playerName, option);
  });

program
  .command('game')
  .alias('g')
  .option('-d, --date <date>', 'Check games at specific date')
  .option('-y, --yesterday', "Check yesterday's games")
  .option('-t, --today', "Check today's games")
  .option('-T, --tomorrow', "Check tomorrow's games")
  .action(option => {
    nbaGo.game(option);
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
