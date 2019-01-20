import NBA from 'nba';
import { getGames, getBoxScore, getPlayByPlay } from 'nba-stats-client';

import nba from '../nba';

jest.mock('nba');
jest.mock('nba-stats-client');

describe('NBA', () => {
  it('updatePlayers should work', async () => {
    await nba.updatePlayers();

    expect(NBA.updatePlayers).toBeCalled();
  });

  it('searchPlayers should work', async () => {
    await nba.searchPlayers();

    expect(NBA.searchPlayers).toBeCalled();
  });

  it('playerInfo should work', async () => {
    await nba.playerInfo();

    expect(NBA.stats.playerInfo).toBeCalled();
  });

  it('playerProfile should work', async () => {
    await nba.playerProfile();

    expect(NBA.stats.playerProfile).toBeCalled();
  });

  it('teamSplits should work', async () => {
    await nba.teamSplits();
    expect(NBA.stats.teamSplits).toBeCalled();
  });

  it('teamInfoCommon should work', async () => {
    await nba.teamInfoCommon();

    expect(NBA.stats.teamInfoCommon).toBeCalled();
  });

  it('getPlayByPlay should work', async () => {
    await nba.getPlayByPlay();

    expect(getPlayByPlay).toBeCalled();
  });

  it('getBoxScore should work', async () => {
    await nba.getBoxScore();

    expect(getBoxScore).toBeCalled();
  });

  it('getGames should work', async () => {
    await nba.getGames();

    expect(getGames).toBeCalled();
  });
});
