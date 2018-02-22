import format from 'date-fns/format';
import { center } from 'wide-align';
import emoji from 'node-emoji';

import getBroadcastNetworks from './network';

import { bold } from '../../utils/log';
import { basicTable } from '../../utils/table';

const alignCenter = columns =>
  columns.map(column => {
    if (typeof column === 'string') {
      return { content: column, vAlign: 'center', hAlign: 'center' };
    }

    return { ...column, vAlign: 'center', hAlign: 'center' };
  });

const createTeamStatsColumns = (
  teamName,
  {
    gp,
    w,
    l,
    pts,
    fgPct,
    fg3Pct,
    ftPct,
    oreb,
    dreb,
    reb,
    ast,
    blk,
    stl,
    tov,
    pf,
    plusMinus,
  }
) => [
  teamName,
  `${w} - ${l}`,
  (w / gp).toFixed(3),
  `${pts}`,
  `${(fgPct * 100).toFixed(1)}`,
  `${(fg3Pct * 100).toFixed(1)}`,
  `${(ftPct * 100).toFixed(1)}`,
  `${oreb}`,
  `${dreb}`,
  `${reb}`,
  `${ast}`,
  `${blk}`,
  `${stl}`,
  `${tov}`,
  `${pf}`,
  `${plusMinus}`,
];

const preview = (
  homeTeam,
  visitorTeam,
  {
    date,
    time,
    arena,
    city,
    state,
    display_year,
    display_season,
    broadcasters,
    homeTeamDashboardData,
    visitorTeamDashboardData,
  }
) => {
  const gamePreviewTable = basicTable();
  const columnMaxWidth = Math.max(
    homeTeam.getFullName({ color: false }).length,
    visitorTeam.getFullName({ color: false }).length
  );
  const networks = getBroadcastNetworks(broadcasters.tv.broadcaster);

  gamePreviewTable.push(
    alignCenter([
      {
        colSpan: 16,
        content: bold(`${display_year} ${display_season}`),
      },
    ]),
    alignCenter([
      {
        colSpan: 16,
        content: bold(
          `${emoji.get('calendar')}  ${format(date, 'YYYY/MM/DD')} ${time.slice(
            0,
            2
          )}:${time.slice(2, 4)}`
        ),
      },
    ]),
    alignCenter([
      {
        colSpan: 16,
        content: bold(`${emoji.get('house')}  ${arena} ｜ ${city}, ${state}`),
      },
    ]),
    alignCenter([
      {
        colSpan: 16,
        content: bold(
          `${networks.homeTeam} ${emoji.get('tv')}  ${networks.visitorTeam}`
        ),
      },
    ]),
    alignCenter(
      createTeamStatsColumns(
        center(homeTeam.getFullName({ color: true }), columnMaxWidth),
        homeTeamDashboardData
      )
    ),
    alignCenter([
      '',
      bold('RECORD'),
      bold('WIN%'),
      bold('PTS'),
      bold('FG%'),
      bold('3P%'),
      bold('FT%'),
      bold('OREB'),
      bold('DREB'),
      bold('REB'),
      bold('AST'),
      bold('BLK'),
      bold('STL'),
      bold('TOV'),
      bold('PF'),
      bold('+/-'),
    ]),
    alignCenter(
      createTeamStatsColumns(
        center(visitorTeam.getFullName({ color: true }), columnMaxWidth),
        visitorTeamDashboardData
      )
    )
  );

  console.log(gamePreviewTable.toString());
};

export default preview;
