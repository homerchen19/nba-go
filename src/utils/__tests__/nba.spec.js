jest.mock('nba');
jest.mock('nba-stats-client');

const NBA = require('nba');
const NBA_client = require('nba-stats-client');
const nba = require('../nba').default;

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

  it('getPlayByPlayFromDate should work', async () => {
    await nba.getPlayByPlayFromDate();

    expect(NBA_client.getPlayByPlayFromDate).toBeCalled();
  });

  it('getBoxScoreFromDate should work', async () => {
    await nba.getBoxScoreFromDate();

    expect(NBA_client.getBoxScoreFromDate).toBeCalled();
  });

  it('getGamesFromDate should work', async () => {
    await nba.getGamesFromDate();

    expect(NBA_client.getGamesFromDate).toBeCalled();
  });
});
