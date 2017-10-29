import emoji from 'node-emoji';
import { getMainColor } from 'nba-color';

export default class Team {
  constructor({
    teamId,
    teamCity,
    teamName,
    teamAbbreviation,
    score,
    w,
    l,
    divRank,
    linescores,
  }) {
    this.id = teamId;
    this.city = teamCity;
    this.name = teamName;
    this.abbreviation = teamAbbreviation;
    this.score = score === '' ? '0' : score;
    this.wins = w;
    this.loses = l;
    this.divRank = divRank;
    this.linescores = linescores ? linescores.period : [];
  }

  getCity() {
    return this.city;
  }

  getAbbreviation() {
    return this.abbreviation;
  }

  getName() {
    return this.name;
  }

  getScore() {
    return this.score;
  }

  getWins() {
    return this.wins;
  }

  getLoses() {
    return this.loses;
  }

  getFullName() {
    return `${this.city} ${this.name}`;
  }

  getColor() {
    const mainColor = getMainColor(this.abbreviation);

    return mainColor ? mainColor.hex : undefined;
  }

  getWinnerName(direction) {
    return direction === 'left'
      ? `${emoji.get('crown')}  ${this.name}`
      : `${this.name} ${emoji.get('crown')}`;
  }

  getQuarterScore(quarter) {
    return this.linescores
      .filter(quarterData => quarterData.period_value === quarter)
      .map(quarterData => quarterData.score);
  }
}
