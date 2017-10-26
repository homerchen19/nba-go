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
  .action(playerName => {
    nbaGo.player(playerName);
  });

program
  .command('game <date>')
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
