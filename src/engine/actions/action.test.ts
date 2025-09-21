import { describe, expect, test } from 'vitest';
import { Player } from '../player';
import Random from '../../strategies/random';
import { Game } from '../game';
import { MoveAction } from './moveAction';
import { DetectAction } from './detectAction';
import { AttackAction } from './attackAction';

const player1 = new Player(1, new Random());
const player2 = new Player(2, new Random());
const game = new Game(1, [player1, player2]);

describe('move action', () => {
  describe('up', () => {
    test('valid', () => {
      player1.position = { x: 2, y: 3 };
      const action = new MoveAction('up');
      action.execute(player1, game);
      expect(player1.position).toEqual({ x: 2, y: 2 });
    });
    test('invalid', () => {
      player1.position = { x: 0, y: 0 };
      const action = new MoveAction('up');
      action.execute(player1, game);
      expect(player1.position).toEqual({ x: 0, y: 0 });
      expect(action.result?.exception).not.toBeNull();
    });
  });

  describe('down', () => {
    test('valid', () => {
      player1.position = { x: 2, y: 3 };
      const action = new MoveAction('down');
      action.execute(player1, game);
      expect(player1.position).toEqual({ x: 2, y: 4 });
    });
    test('invalid', () => {
      player1.position = { x: 0, y: 9 };
      const action = new MoveAction('down');
      action.execute(player1, game);
      expect(player1.position).toEqual({ x: 0, y: 9 });
      expect(action.result?.exception).not.toBeNull();
    });
  });

  describe('left', () => {
    test('valid', () => {
      player1.position = { x: 2, y: 3 };
      const action = new MoveAction('left');
      action.execute(player1, game);
      expect(player1.position).toEqual({ x: 1, y: 3 });
    });
    test('invalid', () => {
      player1.position = { x: 0, y: 9 };
      const action = new MoveAction('left');
      action.execute(player1, game);
      expect(player1.position).toEqual({ x: 0, y: 9 });
      expect(action.result?.exception).not.toBeNull();
    });
  });

  describe('right', () => {
    test('valid', () => {
      player1.position = { x: 2, y: 3 };
      const action = new MoveAction('right');
      action.execute(player1, game);
      expect(player1.position).toEqual({ x: 3, y: 3 });
    });
    test('invalid', () => {
      player1.position = { x: 9, y: 9 };
      const action = new MoveAction('right');
      action.execute(player1, game);
      expect(player1.position).toEqual({ x: 9, y: 9 });
      expect(action.result?.exception).not.toBeNull();
    });
  });
});

describe('detect action', () => {
  test('normal', () => {
    player1.position = { x: 2, y: 3 };
    player2.position = { x: 8, y: 1 };
    const action = new DetectAction();
    action.execute(player1, game);
    expect(action.result?.distance).toBe(8);
  });
  test('same row', () => {
    player1.position = { x: 2, y: 3 };
    player2.position = { x: 6, y: 3 };
    const action = new DetectAction();
    action.execute(player1, game);
    expect(action.result?.distance).toBe(4);
  });
  test('same col', () => {
    player1.position = { x: 2, y: 3 };
    player2.position = { x: 2, y: 9 };
    const action = new DetectAction();
    action.execute(player1, game);
    expect(action.result?.distance).toBe(6);
  });
  test('min', () => {
    player1.position = { x: 2, y: 3 };
    player2.position = { x: 2, y: 3 };
    const action = new DetectAction();
    action.execute(player1, game);
    expect(action.result?.distance).toBe(0);
  });
  test('max', () => {
    player1.position = { x: 0, y: 0 };
    player2.position = { x: 9, y: 9 };
    const action = new DetectAction();
    action.execute(player1, game);
    expect(action.result?.distance).toBe(18);
  });
});

describe('attack action', () => {
  describe('missed', () => {
    test('far', () => {
      player2.position = { x: 9, y: 9 };
      const target = { x: 3, y: 3 };
      const action = new AttackAction(target);
      action.execute(player1, game);
      expect(action.result?.damage).toBe(0);
    });
    test('close', () => {
      player2.position = { x: 9, y: 9 };
      const target = { x: 7, y: 8 };
      const action = new AttackAction(target);
      action.execute(player1, game);
      expect(action.result?.damage).toBe(0);
    });
  });

  describe('normal hit', () => {
    test('corner', () => {
      player2.position = { x: 9, y: 9 };
      const target = { x: 8, y: 8 };
      const action = new AttackAction(target);
      action.execute(player1, game);
      expect(action.result?.damage).toBe(1);
    });
    test('edge', () => {
      player2.position = { x: 9, y: 9 };
      const target = { x: 9, y: 8 };
      const action = new AttackAction(target);
      action.execute(player1, game);
      expect(action.result?.damage).toBe(1);
    });
  });

  test('critical hit', () => {
    player2.position = { x: 9, y: 9 };
    const target = { x: 9, y: 9 };
    const action = new AttackAction(target);
    action.execute(player1, game);
    expect(action.result?.damage).toBe(2);
  });
});
