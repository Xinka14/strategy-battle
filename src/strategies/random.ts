import * as Game from './index';

export default class Random implements Game.Strategy {
  name: string = '随机机器人';
  description: string = `我是用来测试程序的。
  每个动作都随机，输给我就太没面子啦。`;

  reset(): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getActions(_: Game.PublicState): Game.Action[] {
    // 不参考状态，直接返回随机的动作
    const actions: Game.Action[] = [];
    while (actions.reduce((points, action) => points + action.cost, 0) < Game.MAX_ACTION_POINTS) {
      const prob = Math.floor(Math.random() * 3);
      switch (prob) {
        case 0:
          actions.push(new Game.MoveAction(Game.getRandomDirection()));
          break;
        case 1:
          actions.push(new Game.DetectAction());
          break;
        case 2:
          actions.push(new Game.AttackAction(Game.getRandomPosition()));
          break;
        default:
          break;
      }
    }
    return actions;
  }
}
