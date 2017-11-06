import NBA from 'nba';
import pMap from 'p-map';
import emoji from 'node-emoji';

import playerInfo from './info';
import seasonStats from './seasonStats';

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

        seasonStats({
          seasonTtpe: 'Regular Season',
          ...commonPlayerInfo[0],
          seasonTotals: seasonTotalsRegularSeason,
          careerTotals: careerTotalsRegularSeason[0],
        });
      }

      if (option.playoffs) {
        const {
          seasonTotalsPostSeason,
          careerTotalsPostSeason,
        } = await NBA.stats.playerProfile({
          PlayerID: _player.playerId,
        });

        if (careerTotalsPostSeason.length === 0) {
          console.log(
            `Sorry, ${_player.firstName} ${_player.lastName} doesn't have any playoffs data ${emoji.get(
              'confused'
            )}`
          );
        } else {
          commonPlayerInfo[0].nowTeamAbbreviation =
            commonPlayerInfo[0].teamAbbreviation;

          seasonStats({
            seasonTtpe: 'Playoffs',
            ...commonPlayerInfo[0],
            seasonTotals: seasonTotalsPostSeason,
            careerTotals: careerTotalsPostSeason[0],
          });
        }
      }
    },
    { concurrency: 1 }
  );
};

export default player;
