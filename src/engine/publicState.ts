import type { RoundHistory } from './histories/roundHistory';
import type { TurnHistory } from './histories/turnHistory';
import type { Player } from './player';
import type { Action, Position } from './types';

export class PublicState {
  round: number;
  myPosition: Position;
  myHitPoints: number;
  opponentHitPoints: number;
  myTurnHistories: TurnHistory[];
  myActions: Action[];

  constructor(round: number, player: Player, opponent: Player, roundHistories: RoundHistory[]) {
    this.round = round;
    this.myPosition = structuredClone(player.position);
    this.myHitPoints = player.hitPoints;
    this.opponentHitPoints = opponent.hitPoints;
    this.myTurnHistories = roundHistories
      .filter((history) => history.round < this.round)
      .map((history) => {
        return history.playerTurnHistories.find((turn) => turn.no === player.no)!;
      })
      .filter((history) => {
        return history !== undefined && history.actions.length > 0;
      });
    this.myActions = this.myTurnHistories.flatMap((history) => history.actions);
  }

  getLastTurnHistory(): TurnHistory | undefined {
    return this.myTurnHistories[this.myTurnHistories.length - 1];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getLastAction<T extends Action>(type: new (...args: any[]) => T): T | undefined {
    return [...this.myActions].reverse().find((action): action is T => action instanceof type);
  }
}
