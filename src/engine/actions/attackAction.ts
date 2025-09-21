import { getOpponent, isAroundOf, isSamePosition, positionText } from '../../utils';
import type { Game } from '../game';
import type { Player } from '../player';
import type { Position } from '../types';
import { Action } from './action';
import { AttackResult } from './results/attackResult';

export class AttackAction extends Action {
  type: 'move' | 'detect' | 'attack' = 'attack';
  cost: number = 1;
  result?: AttackResult;

  target: Position;

  constructor(target: Position) {
    super();
    this.target = target;
  }

  get description(): string {
    if (this.executed === false) {
      return '尚未完成';
    }

    return `向 ${positionText(this.target)} 攻击: ${this.resultDescription}`;
  }

  execute(player: Player, game: Game): void {
    const result = new AttackResult();

    const opponent = getOpponent(game.players, player);
    let damage;

    if (isSamePosition(this.target, opponent.position)) {
      damage = 2;
    } else if (isAroundOf(this.target, opponent.position)) {
      damage = 1;
    } else {
      damage = 0;
    }

    opponent.hitPoints -= damage;
    result.damage = damage;

    this.result = result;
  }

  isHit(): boolean {
    return (this.result?.damage ?? 0) > 0;
  }
}
