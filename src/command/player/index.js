import pMap from 'p-map';
import emoji from 'node-emoji';

import playerInfo from './info';
import seasonStats from './seasonStats';

import playerInfoCompare from './infoCompare';

import NBA from '../../utils/nba';
import catchAPIError from '../../utils/catchAPIError';
import seasonStatsCompare from './seasonStatsCompare';

const player = async (playerName, option) => {
  await NBA.updatePlayers();

  // split the input by commas and then find matching players and add to array
  // works even if only input 1 player
  const _players = [];
  const nameArray = playerName.split(',');
  nameArray.forEach(name => {
    const playerData = NBA.searchPlayers(name.trim());
    _players.push(...playerData);
  });

  // if we are comparing we need to get all the data first before make the table
  if (option.compare) {
    // get basic info about all the players in array

    // do this a little bit different than the original
    // get all the player data in an array, then will pass to playerInfoCompare and parse it
    const infoMapper = elem => NBA.playerInfo({ PlayerID: elem.playerId });
    let playerDataArr;
    await pMap(_players, infoMapper)
      .then(result => {
        playerDataArr = result;
      })
      .catch(err => catchAPIError(err, 'NBA.playerInfo()'));

    if (option.info) {
      playerInfoCompare(playerDataArr);
    }
    if (option.regular || option.playoffs) {
      const profileMapper = elem =>
        NBA.playerProfile({ PlayerID: elem.playerId });
      let playerProfileArr;
      await pMap(_players, profileMapper)
        .then(result => {
          playerProfileArr = result;
        })
        .catch(err => catchAPIError(err, 'NBA.playerProfile()'));
      if (option.regular) {
        seasonStatsCompare(playerProfileArr, playerDataArr, 'Regular Season');
      }
      if (option.playoffs) {
        seasonStatsCompare(playerProfileArr, playerDataArr, 'Post Season');
      }
    }
  } else {
    pMap(
      _players,
      async _player => {
        let commonPlayerInfo;
        let playerHeadlineStats;

        try {
          const {
            commonPlayerInfo: _commonPlayerInfo,
            playerHeadlineStats: _playerHeadlineStats,
          } = await NBA.playerInfo({
            PlayerID: _player.playerId,
          });

          commonPlayerInfo = _commonPlayerInfo;
          playerHeadlineStats = _playerHeadlineStats;
        } catch (err) {
          catchAPIError(err, 'NBA.playerInfo()');
        }

        if (option.info) {
          playerInfo({ ...commonPlayerInfo[0], ...playerHeadlineStats[0] });
        }

        if (option.regular) {
          let seasonTotalsRegularSeason;
          let careerTotalsRegularSeason;

          try {
            const {
              seasonTotalsRegularSeason: _seasonTotalsRegularSeason,
              careerTotalsRegularSeason: _careerTotalsRegularSeason,
            } = await NBA.playerProfile({
              PlayerID: _player.playerId,
            });

            seasonTotalsRegularSeason = _seasonTotalsRegularSeason;
            careerTotalsRegularSeason = _careerTotalsRegularSeason;
          } catch (err) {
            catchAPIError(err, 'NBA.playerProfile()');
          }

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
          let seasonTotalsPostSeason;
          let careerTotalsPostSeason;
          try {
            const {
              seasonTotalsPostSeason: _seasonTotalsPostSeason,
              careerTotalsPostSeason: _careerTotalsPostSeason,
            } = await NBA.playerProfile({
              PlayerID: _player.playerId,
            });

            seasonTotalsPostSeason = _seasonTotalsPostSeason;
            careerTotalsPostSeason = _careerTotalsPostSeason;
          } catch (err) {
            catchAPIError(err, 'NBA.playerProfile()');
          }

          if (careerTotalsPostSeason.length === 0) {
            console.log(
              `Sorry, ${_player.firstName} ${
                _player.lastName
              } doesn't have any playoffs data ${emoji.get('confused')}`
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
  }
};

export default player;
