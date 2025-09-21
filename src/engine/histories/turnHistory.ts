import { positionText } from '../../utils';
import { Player } from '../player';
import type { Action, Direction, Position } from '../types';

export class TurnHistory {
  no: number;
  position: Position;
  direction: Direction;
  hitPoints: number = 0;

  actions: Action[];

  constructor(player: Player) {
    this.no = player.no;
    this.position = structuredClone(player.position);
    this.direction = player.direction;
    this.hitPoints = player.hitPoints;
    this.actions = [];
  }

  addAction(action: Action) {
    this.actions.push(action);
  }

  get title(): string {
    return `玩家${this.no}的行动，位置: ${positionText(this.position)} HP: ${this.hitPoints}`;
  }
}
