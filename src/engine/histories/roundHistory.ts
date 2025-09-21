import { TurnHistory } from './turnHistory';

export class RoundHistory {
  round: number;
  playerTurnHistories: TurnHistory[] = [];

  constructor(round: number) {
    this.round = round;
  }

  addTurnHistory(history: TurnHistory) {
    this.playerTurnHistories.push(history);
  }

  title(total: number): string {
    return `---------- Round ${this.round} / ${total} ----------`;
  }
}
