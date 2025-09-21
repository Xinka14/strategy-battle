import * as Game from './index';

export default class Cannon implements Game.Strategy {
  name: string = '大炮';
  description: string = `进攻狂！
  开炮，开炮，不停地开炮。`;

  reset(): void {}

  getActions(state: Game.PublicState): Game.Action[] {
    let action: Game.AttackAction | undefined = undefined;

    // 获取上一回合的动作结果
    const lastTurnActions: Game.AttackAction[] = (state.getLastTurnHistory()?.actions ?? []).filter((action) => action instanceof Game.AttackAction);
    if (lastTurnActions.length > 0) {
      // 按伤害从高到低排序
      lastTurnActions.sort((a, b) => (b.result?.damage ?? 0) - (a.result?.damage ?? 0));
      // 如果有命中，就继续打
      if (lastTurnActions[0].isHit() === true) {
        action = lastTurnActions[0];
      }
    }

    const actions: Game.Action[] = [];
    while (actions.reduce((points, action) => points + action.cost, 0) < Game.MAX_ACTION_POINTS) {
      if (action !== undefined) {
        actions.push(new Game.AttackAction(action.target));
      } else {
        actions.push(new Game.AttackAction(Game.getRandomPosition()));
      }
    }
    return actions;
  }
}
