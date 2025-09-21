import type { AttackAction } from './actions/attackAction';
import type { DetectAction } from './actions/detectAction';
import type { MoveAction } from './actions/moveAction';

export interface Position {
  x: number;
  y: number;
}

export const Directions = ['up', 'down', 'left', 'right'] as const;
export type Direction = (typeof Directions)[number];

export type Action = MoveAction | DetectAction | AttackAction;

export type PlayerNo = 1 | 2;
