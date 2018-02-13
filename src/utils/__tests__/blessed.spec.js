import getBlessed from '../blessed';

jest.mock('blessed');

const blessed = require('blessed');

const mockTeam = () => ({
  getFullName: jest.fn(() => 'Golden State Warriors'),
  getWins: jest.fn(() => '82'),
  getLoses: jest.fn(() => '82'),
});

describe('getBlessed', () => {
  beforeEach(() => {
    blessed.screen.mockReturnValue({
      append: jest.fn(),
      key: jest.fn((keyArr, cb) => {
        process.stdin.on('keypress', (ch, key) => {
          if (key && keyArr.indexOf(key.name) > -1) {
            cb();
          }
        });
      }),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should exist', () => {
    expect(getBlessed).toBeDefined();
  });

  describe('screen', () => {
    it('should call blessed.screen once', () => {
      getBlessed(mockTeam(), mockTeam());

      expect(blessed.screen).toBeCalledWith({
        smartCSR: true,
        fullUnicode: true,
        title: 'NBA-GO',
      });
      expect(blessed.screen.mock.calls.length).toBe(1);
    });

    it('should append 15 components and 1 key event', () => {
      const { screen } = getBlessed(mockTeam(), mockTeam());

      expect(screen.append.mock.calls.length).toBe(15);
      expect(screen.key.mock.calls.length).toBe(1);
    });
  });

  describe('others', () => {
    it('should call blessed.box twice, blessed.table twice, blessed.text 9 times and blessed.bigtext twice', () => {
      getBlessed(mockTeam(), mockTeam());

      expect(blessed.box.mock.calls.length).toBe(2);
      expect(blessed.table.mock.calls.length).toBe(2);
      expect(blessed.text.mock.calls.length).toBe(9);
      expect(blessed.bigtext.mock.calls.length).toBe(2);
    });

    it('should call process.exit when press esc', () => {
      process.exit = jest.fn();
      getBlessed(mockTeam(), mockTeam());

      process.stdin.emit('keypress', '', { name: 'escape' });
      expect(process.exit).toBeCalledWith(1);
    });
  });
});
