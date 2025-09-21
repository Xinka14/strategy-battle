import { BOARD_SIZE } from '../../constants';
import { directionText } from '../../utils';
import type { Game } from '../game';
import type { Player } from '../player';
import type { Direction } from '../types';
import { Action } from './action';
import { MoveResult } from './results/moveResult';

export class MoveAction extends Action {
  type: 'move' | 'detect' | 'attack' = 'move';
  cost: number = 1;
  result?: MoveResult;

  direction: Direction;

  constructor(direction: Direction) {
    super();
    this.direction = direction;
  }

  get description(): string {
    return `向 ${directionText(this.direction)} 移动: ${this.resultDescription}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute(player: Player, _: Game): void {
    const result = new MoveResult();

    let offsetX = 0;
    let offsetY = 0;
    switch (this.direction) {
      case 'up':
        offsetY = -1;
        break;
      case 'down':
        offsetY = 1;
        break;
      case 'left':
        offsetX = -1;
        break;
      case 'right':
        offsetX = 1;
        break;
      default:
        throw new Error(`Unknown direction: ${this.direction}`);
    }

    if (offsetX !== 0) {
      if (player.position.x + offsetX < 0 || player.position.x + offsetX >= BOARD_SIZE) {
        result.exception = new Error('无法移动，出界了');
      } else {
        player.position.x += offsetX;
        result.position = structuredClone(player.position);
      }
    }
    if (offsetY !== 0) {
      if (player.position.y + offsetY < 0 || player.position.y + offsetY >= BOARD_SIZE) {
        result.exception = new Error('无法移动，出界了');
      } else {
        player.position.y += offsetY;
        result.position = structuredClone(player.position);
      }
    }
    player.direction = this.direction;

    this.result = result;
  }
}
