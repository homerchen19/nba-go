import NBA from 'nba';
import pMap from 'p-map';

import playerInfo from './info';
import regularSeason from './regularSeason';

const player = async (playerName, option) => {
  await NBA.updatePlayers();

  const _players = await NBA.searchPlayers(playerName);

  pMap(
    _players,
    async _player => {
      const {
        commonPlayerInfo,
        playerHeadlineStats,
      } = await NBA.stats.playerInfo({
        PlayerID: _player.playerId,
      });

      if (option.info) {
        playerInfo({ ...commonPlayerInfo[0], ...playerHeadlineStats[0] });
      }

      if (option.regular) {
        const {
          seasonTotalsRegularSeason,
          careerTotalsRegularSeason,
        } = await NBA.stats.playerProfile({
          PlayerID: _player.playerId,
        });
        commonPlayerInfo[0].nowTeamAbbreviation =
          commonPlayerInfo[0].teamAbbreviation;

        regularSeason({
          ...commonPlayerInfo[0],
          seasonTotalsRegularSeason,
          careerTotalsRegularSeason: careerTotalsRegularSeason[0],
        });
      }
    },
    { concurrency: 5 }
  );
};

export default player;
