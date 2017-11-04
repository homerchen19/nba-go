/* eslint-disable no-console */
import chalk from 'chalk';

import { error, bold, neonGreen, colorTeamName } from '../log';

const _log = console.log;

describe('console', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });
  afterEach(() => {
    console.log = _log;
  });

  it('error', () => {
    error('error!');
    expect(console.log).toBeCalledWith(chalk`{red.bold error!}`);
  });

  it('bold', () => {
    expect(bold('bold!')).toEqual(chalk`{white.bold bold!}`);
  });

  it('neonGreen', () => {
    expect(neonGreen('neonGreen!')).toEqual(chalk`{hex('#66ff66') neonGreen!}`);
  });

  it('colorTeamName', () => {
    expect(colorTeamName('#123456', 'Cool')).toEqual(
      chalk`{bold.white.bgHex('123456') Cool}`
    );
  });
});
