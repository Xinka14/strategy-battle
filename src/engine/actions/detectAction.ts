import { getDistance, getOpponent } from '../../utils';
import type { Game } from '../game';
import type { Player } from '../player';
import type { Position } from '../types';
import { Action } from './action';
import { DetectResult } from './results/detectResult';

export class DetectAction extends Action {
  type: 'move' | 'detect' | 'attack' = 'detect';
  cost: number = 1;
  result?: DetectResult;

  origin?: Position;

  constructor() {
    super();
  }

  get description(): string {
    if (this.executed === false) {
      return '尚未完成';
    }

    return `侦测对手: ${this.resultDescription}`;
  }

  execute(player: Player, game: Game): void {
    this.origin = structuredClone(player.position);

    const result = new DetectResult();

    const opponent = getOpponent(game.players, player);
    const distance = getDistance(player.position, opponent.position);
    result.distance = distance;

    this.result = result;
  }
}
