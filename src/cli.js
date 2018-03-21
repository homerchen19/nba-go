/* eslint-disable no-param-reassign */

import program from 'commander';
import didYouMean from 'didyoumean';
import isAsyncSupported from 'is-async-supported';
import chalk from 'chalk';
import updateNotifier from 'update-notifier';

import nbaGo from './command';
import { error, bold, nbaRed, neonGreen } from './utils/log';

import pkg from '../package.json';

if (!isAsyncSupported()) {
  require('async-to-gen/register');
}

(async () => {
  await updateNotifier({
    pkg,
  }).notify({ defer: false });
})();

program.version(
  `\n${chalk`{bold.hex('#0069b9') NBA}`} ${nbaRed('GO')} version: ${
    pkg.version
  }\n`,
  '-v, --version'
);

program
  .command('player <name>')
  .alias('p')
  .option('-i, --info', "Check the player's basic information")
  .option('-r, --regular', "Check the player's career regular season data")
  .option('-p, --playoffs', "Check the player's career playoffs data")
  .option(
    '-c, --compare',
    "Compare the stats of two or more players. Seperate the names with commas, ex:'Stepen Curry, Lebron James'"
  )
  .on('--help', () => {
    console.log('');
    console.log(
      "  Get player's basic information, regular season data and playoffs data."
    );
    console.log('');
    console.log('  Example:');
    console.log(
      `           ${neonGreen(
        'nba-go player Curry'
      )}    => Show both Seth Curry's and Stephen Curry's basic information.`
    );
    console.log(
      `           ${neonGreen(
        'nba-go player Curry -r'
      )} => Show both Seth Curry's and Stephen Curry's regular season data.`
    );
    console.log('');
    console.log(`  For more detailed information, please check the GitHub page: ${neonGreen(
      'https://github.com/xxhomey19/nba-go#player'
    )}
  `);
  })
  .action((name, option) => {
    if (!option.info && !option.regular && !option.playoffs) {
      option.info = true;
    }
    nbaGo.player(name, option);
  });

program
  .command('game')
  .alias('g')
  .option('-d, --date <date>', 'Watch games at specific date')
  .option('-y, --yesterday', "Watch yesterday's games")
  .option('-t, --today', "Watch today's games")
  .option('-T, --tomorrow', "Watch tomorrow's games")
  .option('-f, --filter <filter>', 'Filter game choices to watch')
  .option('-n, --networks', 'See the networks game is/was televised on.')
  .on('--help', () => {
    console.log('');
    console.log('  Watch NBA live play-by-play, game preview and box score.');
    console.log("  You have to enter what day's schedule at first.");
    console.log(
      `  Notice that if you don't provide any option, default date will be ${neonGreen(
        'today'
      )}.`
    );
    console.log('');
    console.log('  Example:');
    console.log(
      `           ${neonGreen(
        'nba-go game -d 2017/11/11'
      )} => Show game schedule on 2017/11/11.`
    );
    console.log(
      `           ${neonGreen(
        'nba-go game -t'
      )}            => Show today's game schedule.`
    );
    console.log('');
    console.log(`  For more detailed information, please check the GitHub page: ${neonGreen(
      'https://github.com/xxhomey19/nba-go#game'
    )}
  `);
  })
  .action(option => {
    if (
      !option.date &&
      !option.yesterday &&
      !option.today &&
      !option.tomorrow
    ) {
      option.today = true;
    }
    nbaGo.game(option);
  });

program.on('--help', () => {
  console.log('');
  console.log('');
  console.log(
    `  Welcome to ${chalk`{bold.hex('#0069b9') NBA}`} ${nbaRed('GO')} !`
  );
  console.log('');
  console.log(
    `  Wanna watch NBA game please enter: ${neonGreen('nba-go game')}`
  );
  console.log(
    `  Wanna check NBA player information please enter: ${neonGreen(
      'nba-go player <name>'
    )}`
  );
  console.log('');
  console.log(
    `  For more detailed information please check the GitHub page: ${neonGreen(
      'https://github.com/xxhomey19/nba-go'
    )}`
  );
  console.log(
    `  Or enter ${neonGreen('nba-go game -h')}, ${neonGreen(
      'nba-go player -h'
    )} to get more helpful information.`
  );
  console.log('');
});

program.command('*').action(command => {
  error(`Unknown command: ${bold(command)}`);
  const commandNames = program.commands
    .map(c => c._name)
    .filter(name => name !== '*');

  const closeMatch = didYouMean(command, commandNames);
  if (closeMatch) {
    error(`Did you mean ${bold(closeMatch)} ?`);
  }
  process.exit(1);
});

if (process.argv.length === 2) program.help();

program.parse(process.argv);
