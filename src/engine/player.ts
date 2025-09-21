import { MAX_HIT_POINTS } from '../constants';
import type { Strategy } from '../strategies';
import { getRandomPosition } from '../utils';
import type { Direction, PlayerNo, Position } from './types';

export class Player {
  no: PlayerNo;
  strategy: Strategy;
  position: Position = { x: 0, y: 0 };
  direction: Direction = 'up';
  hitPoints: number = 0;

  constructor(no: PlayerNo, strategy: Strategy) {
    this.no = no;
    this.strategy = strategy;
  }

  get isDead(): boolean {
    return this.hitPoints <= 0;
  }

  get name(): string {
    return `玩家${this.no}-${this.strategy.name}`;
  }

  reset() {
    this.position = getRandomPosition();
    this.hitPoints = MAX_HIT_POINTS;
    this.strategy.reset();
  }
}
