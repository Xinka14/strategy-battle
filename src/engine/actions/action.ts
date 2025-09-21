import { MAX_ACTION_POINTS } from '../../constants';
import { assertNotNull } from '../../utils';
import type { Game } from '../game';
import type { Player } from '../player';
import type { ActionResult } from './results/actionResult';
import { SkipResult } from './results/skipResult';

export abstract class Action {
  abstract type: 'move' | 'detect' | 'attack';
  abstract cost: number;
  abstract result?: ActionResult;

  abstract get description(): string;

  abstract execute(player: Player, game: Game): void;

  get executed(): boolean {
    return this.result !== null && this.result !== undefined;
  }

  get resultDescription(): string {
    if (this.executed === false) {
      return '尚未完成';
    }

    assertNotNull(this.result);
    return this.result.description;
  }

  tryExecute(usedPoints: number, player: Player, game: Game): number {
    if (usedPoints + this.cost > MAX_ACTION_POINTS) {
      this.result = new SkipResult();
      return 0;
    } else {
      this.execute(player, game);
      return this.cost;
    }
  }
}
