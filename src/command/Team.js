import emoji from 'node-emoji';
import { getMainColor } from 'nba-color';

export default class Team {
  constructor({ id, city, abbreviation, nickname, score }) {
    this.id = id;
    this.city = city;
    this.abbreviation = abbreviation;
    this.nickname = nickname;
    this.score = score === '' ? '0' : score;
  }

  getCity() {
    return this.city;
  }

  getAbbreviation() {
    return this.abbreviation;
  }

  getNickname() {
    return this.nickname;
  }

  getScore() {
    return this.score;
  }

  getFullName() {
    return `${this.city} ${this.nickname}`;
  }

  getColor() {
    const mainColor = getMainColor(this.abbreviation);

    return mainColor ? mainColor.hex : undefined;
  }

  getWinnerNickname(direction) {
    return direction === 'left'
      ? `${emoji.get('crown')}  ${this.nickname}`
      : `${this.nickname} ${emoji.get('crown')}`;
  }
}
