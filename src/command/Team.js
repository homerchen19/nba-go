import emoji from 'node-emoji';

import teamColor from '../utils/teamColor';

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
    return teamColor[this.abbreviation].color;
  }

  getWinnerNickname(direction) {
    return direction === 'left'
      ? `${emoji.get('crown')}  ${this.nickname}`
      : `${this.nickname} ${emoji.get('crown')}`;
  }
}
