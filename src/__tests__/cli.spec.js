jest.mock('update-notifier');

jest.mock('../command');
jest.mock('../utils/log');

const _exit = process.exit;

let log;
let nbaGo;
let updateNotifier;

const setup = () => {
  updateNotifier = require('update-notifier');
  updateNotifier.mockReturnValue({ notify: jest.fn() });
  log = require('../utils/log');
  log.error = jest.fn();
  log.bold = jest.fn(s => s);
  nbaGo = require('../command').default;
  require('../cli');
};

describe('cli', () => {
  beforeEach(() => {
    process.exit = jest.fn();
  });

  afterEach(() => {
    process.exit = _exit;
    jest.resetModules();
  });

  it('should call updateNotifier at first', () => {
    process.argv = ['node', 'bin/cli.js', 'games'];
    setup();

    expect(updateNotifier).toBeCalled();
  });

  it('should call error when the command not matched', () => {
    process.argv = ['node', 'bin/cli.js', 'QQ'];
    setup();

    expect(log.error).toBeCalledWith(`Unknown command: ${log.bold('QQ')}`);
    expect(process.exit).toBeCalledWith(1);
  });

  it('should call didYouMean when the command is similar to specific commands', () => {
    process.argv = ['node', 'bin/cli.js', 'games'];
    setup();

    expect(log.error.mock.calls.length).toBe(2);
    expect(log.error.mock.calls[0][0]).toBe(
      `Unknown command: ${log.bold('games')}`
    );
    expect(log.error.mock.calls[1][0]).toBe(
      `Did you mean ${log.bold('game')} ?`
    );
    expect(process.exit).toBeCalledWith(1);
  });

  describe('player command', () => {
    it('should call nbaGo with option -i', () => {
      process.argv = ['node', 'bin/cli.js', 'player', 'Curry', '-i'];
      setup();

      expect(nbaGo.player.mock.calls[0][0]).toBe('Curry');
      expect(nbaGo.player.mock.calls[0][1].info).toBe(true);
    });

    it('should call nbaGo with option -r', () => {
      process.argv = ['node', 'bin/cli.js', 'player', 'Curry', '-r'];
      setup();

      expect(nbaGo.player.mock.calls[0][0]).toBe('Curry');
      expect(nbaGo.player.mock.calls[0][1].regular).toBe(true);
    });

    it('should call nbaGo with option -p', () => {
      process.argv = ['node', 'bin/cli.js', 'player', 'Curry', '-p'];
      setup();

      expect(nbaGo.player.mock.calls[0][0]).toBe('Curry');
      expect(nbaGo.player.mock.calls[0][1].playoffs).toBe(true);
    });

    it('should call nbaGo with option -i when user did not enter any option', () => {
      process.argv = ['node', 'bin/cli.js', 'player', 'Curry'];
      setup();

      expect(nbaGo.player.mock.calls[0][0]).toBe('Curry');
      expect(nbaGo.player.mock.calls[0][1].info).toBe(true);
    });

    it('alias should work', () => {
      process.argv = ['node', 'bin/cli.js', 'p', 'Curry'];
      setup();

      expect(nbaGo.player.mock.calls[0][0]).toBe('Curry');
      expect(nbaGo.player.mock.calls[0][1].info).toBe(true);
    });
  });

  describe('game command', () => {
    it('should call nbaGo with option -t when user did not enter any option', () => {
      process.argv = ['node', 'bin/cli.js', 'game'];
      setup();

      expect(nbaGo.game.mock.calls[0][0].today).toBe(true);
    });

    it('should call nbaGo with option -d and date', () => {
      process.argv = ['node', 'bin/cli.js', 'game', '-d', '2017/11/11'];
      setup();

      expect(nbaGo.game.mock.calls[0][0].date).toBe('2017/11/11');
    });

    it('should call nbaGo with option -y', () => {
      process.argv = ['node', 'bin/cli.js', 'game', '-y'];
      setup();

      expect(nbaGo.game.mock.calls[0][0].yesterday).toBe(true);
    });

    it('should call nbaGo with option -t', () => {
      process.argv = ['node', 'bin/cli.js', 'game', '-t'];

      setup();

      expect(nbaGo.game.mock.calls[0][0].today).toBe(true);
    });

    it('should call nbaGo with option -T', () => {
      process.argv = ['node', 'bin/cli.js', 'game', '-T'];

      setup();

      expect(nbaGo.game.mock.calls[0][0].tomorrow).toBe(true);
    });

    it('should call nbaGo with option -n', () => {
      process.argv = ['node', 'bin/cli.js', 'game', '-n'];

      setup();

      expect(nbaGo.game.mock.calls[0][0].networks).toBe(true);
    });

    it('alias should work', () => {
      process.argv = ['node', 'bin/cli.js', 'p', 'Curry'];
      setup();

      expect(nbaGo.player.mock.calls[0][0]).toBe('Curry');
      expect(nbaGo.player.mock.calls[0][1].info).toBe(true);
    });

    it('should call nbaGo with option to view specific team', () => {
      process.argv = ['node', 'bin/cli.js', 'game', '--filter', 'team=Pistons'];
      setup();

      expect(nbaGo.game.mock.calls[0][0].filter).toBe('team=Pistons');
    });
  });
});
