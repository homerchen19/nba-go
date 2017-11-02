import { getMainColor } from 'nba-color';
import { left, right } from 'wide-align';
import get from 'lodash/get';

import { bold, neonGreen, colorTeamName } from '../../utils/log';

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

const getTeamQuaterScores = (team, latestPeriod) => {
  const teamQuaterScores = [
    `${team.getAbbreviation({
      color: true,
    })}`,
  ];

  for (let i = 1; i <= latestPeriod; i += 1) {
    teamQuaterScores.push(bold(team.getQuarterScore(`${i}`)));
  }

  teamQuaterScores.push(neonGreen(team.getScore()));

  return teamQuaterScores;
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
    const time = `${+overtimePeriod > 1 ? 'OT' : 'Q'}${+overtimePeriod > 1
      ? overtimePeriod
      : period} ${clock !== '' ? clock : '12:00'}`;

    const sroceboard = `${right(
      home_score > get(allPlays[i + 1], 'home_score')
        ? bold(neonGreen(home_score))
        : bold(home_score),
      3
    )} - ${left(
      visitor_score > get(allPlays[i + 1], 'visitor_score')
        ? bold(neonGreen(visitor_score))
        : bold(visitor_score),
      3
    )}`;
    const teamColor = getMainColor(team_abr)
      ? getMainColor(team_abr).hex
      : '#000';
    const description = `${left(
      colorTeamName(teamColor, `${team_abr}`),
      5
    )} ${eventDescription.replace(/\[.*\]/i, '')}\n`;

    playByPlayRows.push([time, sroceboard, description].join('  │  '));
  }

  return playByPlayRows.join('\n');
};

const createGamePlayByPlay = (
  homeTeam,
  visitorTeam,
  playByPlayData,
  blessedComponents
) => {
  const { play: allPlays, isFinal } = playByPlayData;
  const { period: latestPeriod, clock: latestClock } = allPlays.slice(-1).pop();
  const scoreboardTableHeader = getScoreboardTableHeader(latestPeriod);
  const {
    screen,
    scoreboardTable,
    timeText,
    homeTeamScoreText,
    visitorTeamScoreText,
    playByPlayTable,
  } = blessedComponents;

  scoreboardTable.setRows([
    scoreboardTableHeader,
    getTeamQuaterScores(homeTeam, latestPeriod),
    getTeamQuaterScores(visitorTeam, latestPeriod),
  ]);

  playByPlayTable.setContent(getPlayByPlayRows(allPlays));
  playByPlayTable.focus();

  if (isFinal) {
    timeText.setContent(bold('Final'));
  } else {
    const overtimePeriod = getOvertimePeriod(latestPeriod);
    timeText.setContent(
      bold(
        `${+overtimePeriod > 1 ? 'OT' : 'Q'}${+overtimePeriod > 1
          ? overtimePeriod
          : latestPeriod} ${latestClock}`
      )
    );
  }

  homeTeamScoreText.setContent(homeTeam.getScore());
  visitorTeamScoreText.setContent(visitorTeam.getScore());

  screen.render();
};

export default createGamePlayByPlay;
