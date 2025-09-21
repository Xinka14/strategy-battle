import { BOARD_SIZE } from './constants';
import { Player } from './engine/player';
import { Directions, type Direction, type Position } from './engine/types';

export function getRandomPosition() {
  return { x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) };
}

export function positionText(position: Position): string {
  return `(${position.x},${position.y})`;
}

export function getDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

export function isSamePosition(pos1: Position, pos2: Position): boolean {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

export function isAroundOf(target: Position, position: Position): boolean {
  const startX = target.x - 1;
  const endX = target.x + 1;
  const startY = target.y - 1;
  const endY = target.y + 1;
  return position.x >= startX && position.x <= endX && position.y >= startY && position.y <= endY && !isSamePosition(target, position);
}

export function getPositionsByDistance(origin: Position, distance: number): Position[] {
  const results: Position[] = [];

  for (let dx = 0; dx <= distance; dx++) {
    const dy = distance - dx;
    const candidates: Position[] = [
      { x: origin.x + dx, y: origin.y + dy },
      { x: origin.x + dx, y: origin.y - dy },
      { x: origin.x - dx, y: origin.y + dy },
      { x: origin.x - dx, y: origin.y - dy },
    ];

    candidates
      .filter((candidate) => {
        return candidate.x >= 0 && candidate.x <= BOARD_SIZE && candidate.y >= 0 && candidate.y <= BOARD_SIZE;
      })
      .filter((candidate) => {
        return results.some((result) => isSamePosition(result, candidate)) === false;
      })
      .forEach((candidate) => results.push(candidate));
  }

  return results;
}

export function getRandomDirection() {
  return Directions[Math.floor(Math.random() * 4)];
}

export function directionText(direction: Direction): string {
  switch (direction) {
    case 'up':
      return '上';
    case 'down':
      return '下';
    case 'left':
      return '左';
    case 'right':
      return '右';
    default:
      throw new Error(`Unknown direction ${direction}`);
  }
}

export function getOpponent(players: Player[], me: Player): Player {
  const opponent = players.find((p) => p.no !== me.no);
  if (opponent === undefined) {
    throw new Error('Opponent not found');
  }
  return opponent;
}

export function assertNotNull<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Value must not be null or undefined');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assertInstanceOf<T>(value: unknown, ctor: new (...args: any[]) => T): asserts value is T {
  if (!(value instanceof ctor)) {
    const name = ctor.name || 'UnknownClass';
    throw new Error(`Value must be an instance of ${name}`);
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
