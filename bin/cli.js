const program = require('commander');
const didYouMean = require('didyoumean');
const isAsyncSupported = require('is-async-supported');

const pkg = require('../package.json');

const { error, bold } = require('../src/log');

if (!isAsyncSupported()) {
  require('async-to-gen/register');
}

program.version(pkg.version);

program.command('nba-go <command>').action(command => {
  console.log(command);
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
