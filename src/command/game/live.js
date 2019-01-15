import { getMainColor } from 'nba-color';
import { left, right } from 'wide-align';
import R from 'ramda';
import emoji from 'node-emoji';

import { bold, nbaRed, neonGreen, colorTeamName } from '../../utils/log';

const checkOverStandard = (record, standard) =>
  +record >= standard ? nbaRed(record) : record;

const updateTeamQuarterScores = (team, latestPeriod, teamPeriod) => {
  // eslint-disable-next-line no-param-reassign
  teamPeriod = Array.isArray(teamPeriod) ? teamPeriod : [teamPeriod];

  const latestQuarterScore = teamPeriod.find(
    quarter => quarter.period_value === latestPeriod
  );

  if (latestQuarterScore && latestQuarterScore.score && latestPeriod) {
    if (team.getIsHomeTeam()) {
      team.setQuarterScore(latestPeriod, latestQuarterScore.score);
    } else {
      team.setQuarterScore(latestPeriod, latestQuarterScore.score);
    }
  }
};

const getOvertimePeriod = latestPeriod => parseInt(latestPeriod, 10) - 4;

const getScoreboardTableHeader = latestPeriod => {
  const scoreboardTableHeader = ['', 'Q1', 'Q2', 'Q3', 'Q4'];
  const overtimePeriod = getOvertimePeriod(latestPeriod);

  for (let i = 0; i < overtimePeriod; i += 1) {
    scoreboardTableHeader.push(`OT${overtimePeriod}`);
  }

  scoreboardTableHeader.push('Total');
  return scoreboardTableHeader;
};

const getTeamQuarterScores = (team, latestPeriod) => {
  const teamQuarterScores = [
    `${team.getAbbreviation({
      color: true,
    })}`,
  ];

  for (let i = 1; i <= latestPeriod; i += 1) {
    teamQuarterScores.push(bold(team.getQuarterScore(`${i}`)));
  }
  for (let i = 0; i < 4 - latestPeriod; i += 1) {
    teamQuarterScores.push('  ');
  }

  teamQuarterScores.push(neonGreen(team.getScore()));

  return teamQuarterScores;
};

const getPlayByPlayRows = allPlays => {
  allPlays.reverse();

  const playByPlayRows = [];

  for (let i = 0; i < allPlays.length; i += 1) {
    const {
      clock,
      period,
      description: eventDescription,
      home_score,
      visitor_score,
      team_abr,
    } = allPlays[i];

    const overtimePeriod = getOvertimePeriod(period);
    const time = `${+overtimePeriod > 1 ? 'OT' : 'Q'}${
      +overtimePeriod > 1 ? overtimePeriod : period
    } ${clock !== '' ? clock : '12:00'}`;

    const scoreboard = `${right(
      home_score > R.prop('home_score', allPlays[i + 1])
        ? bold(neonGreen(home_score))
        : bold(home_score),
      3
    )} - ${left(
      visitor_score > R.prop('visitor_score', allPlays[i + 1])
        ? bold(neonGreen(visitor_score))
        : bold(visitor_score),
      3
    )}`;
    const teamColor = getMainColor(team_abr)
      ? getMainColor(team_abr).hex
      : '#000';
    const description = `${left(
      colorTeamName(teamColor, `${team_abr}`),
      3
    )} ${eventDescription.replace(/\[.*\]/i, '')}\n`;

    playByPlayRows.push([time, scoreboard, description].join(' │ '));
  }

  return playByPlayRows.join('\n');
};

const getTeamBoxscore = (team, playersData) => {
  const teamBoxscoreRows = [];
  teamBoxscoreRows.push([
    team.getAbbreviation({ color: true }),
    bold('PTS'),
    bold('AST'),
    bold('REB'),
  ]);

  const mainPlayers = playersData
    .sort((playerA, playerB) => +playerB.minutes - +playerA.minutes)
    .slice(0, 5);

  mainPlayers.forEach(player => {
    teamBoxscoreRows.push([
      bold(left(player.last_name, 14)),
      left(checkOverStandard(player.points, 20), 3),
      left(checkOverStandard(player.assists, 10), 3),
      left(
        `${checkOverStandard(
          +player.rebounds_offensive + +player.rebounds_defensive,
          10
        )}`,
        3
      ),
    ]);
  });

  return teamBoxscoreRows;
};

const live = (
  homeTeam,
  visitorTeam,
  playByPlayData,
  gameBoxScoreData,
  blessedComponents
) => {
  const { play: allPlays, isFinal } = playByPlayData;
  const { period: latestPeriod, clock: latestClock } = allPlays.slice(-1).pop();
  const {
    screen,
    scoreboardTable,
    timeText,
    homeTeamScoreText,
    visitorTeamScoreText,
    playByPlayBox,
    boxscoreTable,
  } = blessedComponents;

  const {
    home: {
      linescores: { period: homeTeamPeriod },
    },
    visitor: {
      linescores: { period: visitorTeamPeriod },
    },
  } = gameBoxScoreData;

  updateTeamQuarterScores(homeTeam, latestPeriod, homeTeamPeriod);
  updateTeamQuarterScores(visitorTeam, latestPeriod, visitorTeamPeriod);

  scoreboardTable.setRows([
    getScoreboardTableHeader(latestPeriod),
    getTeamQuarterScores(homeTeam, latestPeriod),
    getTeamQuarterScores(visitorTeam, latestPeriod),
  ]);

  boxscoreTable.setRows([
    ...getTeamBoxscore(homeTeam, gameBoxScoreData.home.players.player),
    ...getTeamBoxscore(visitorTeam, gameBoxScoreData.visitor.players.player),
  ]);

  playByPlayBox.setContent(getPlayByPlayRows(allPlays));
  playByPlayBox.focus();

  if (isFinal) {
    timeText.setContent(bold('Final'));
  } else {
    const overtimePeriod = getOvertimePeriod(latestPeriod);
    timeText.setContent(
      bold(
        `${emoji.get('stopwatch')}  ${+overtimePeriod > 1 ? 'OT' : 'Q'}${
          +overtimePeriod > 1 ? overtimePeriod : latestPeriod
        } ${latestClock}`
      )
    );
  }

  homeTeamScoreText.setContent(homeTeam.getScore());
  visitorTeamScoreText.setContent(visitorTeam.getScore());

  screen.render();
};

export default live;
