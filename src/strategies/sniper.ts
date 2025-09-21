import * as Game from './index';

interface Candidate {
  position: Game.Position;
  priority: number; // 2: 暴击, 1: 命中, 0.2: 还没有尝试攻击过, 0: 打空
}

export default class Sniper implements Game.Strategy {
  name: string = '狙击手';
  description: string = `瞄准了再打！
  不喜欢浪费弹药。`;

  candidates: Candidate[] = [];

  reset(): void {
    this.candidates = [];
  }

  getActions(state: Game.PublicState): Game.Action[] {
    // 目前的候选位置，每一回合优先级减掉0.1
    this.candidates.forEach((candidate) => (candidate.priority -= 0.1));

    // 分析上一个回合的结果，更新候选位置
    const lastTurnActions: Game.Action[] = state.getLastTurnHistory()?.actions ?? [];
    lastTurnActions.forEach((action) => {
      if (action instanceof Game.AttackAction) {
        Game.assertNotNull(action.result?.damage);
        switch (action.result.damage) {
          case 0:
          case 2: {
            const found = this.candidates.findIndex((candidate) => Game.isSamePosition(candidate.position, action.target));
            if (found >= 0) {
              this.candidates[found].priority = action.result.damage;
            }
            break;
          }
          case 1:
            this.candidates = this.candidates.map((candidate) => {
              if (Game.isAroundOf(action.target, candidate.position)) {
                candidate.priority += 1;
              }
              return candidate;
            });
            break;
          default:
            break;
        }
      } else if (action instanceof Game.DetectAction) {
        Game.assertNotNull(action.origin);
        Game.assertNotNull(action.result?.distance);
        const distance = action.result.distance;
        const positions = Game.shuffleArray(Game.getPositionsByDistance(action.origin, distance));
        // 去掉无效的候选位置: 不符合最新的距离
        this.candidates = this.candidates.filter((candidate) => {
          return positions.some((position) => Game.isSamePosition(position, candidate.position));
        });
        // 添加最新的候选位置
        positions.forEach((position) => {
          const found = this.candidates.findIndex((candidate) => Game.isSamePosition(position, candidate.position));
          if (found >= 0) {
            this.candidates[found].priority += 0.2; // 加算优先级: 既符合旧的距离，也符合新的距离的位置几率更高
          } else {
            this.candidates.push({
              position: structuredClone(position),
              priority: 0.2,
            });
          }
        });
      } else {
        // ignore
      }
    });

    // 去掉无效的候选位置: 打空 OR 经过了2回合以上还没轮到的
    this.candidates = this.candidates.filter((candidate) => {
      return candidate.priority > 0;
    });

    const actions: Game.Action[] = [];
    if (this.candidates.length === 0) {
      // 如果没有候选位置，就进行一次侦测，然后随机攻击
      actions.push(new Game.DetectAction());
      while (actions.reduce((points, action) => points + action.cost, 0) < Game.MAX_ACTION_POINTS) {
        actions.push(new Game.AttackAction(Game.getRandomPosition()));
      }
    } else {
      // 如果有候选位置，就按优先级轮流对这些位置进行攻击
      this.candidates.sort((a, b) => b.priority - a.priority);
      let index = 0;
      while (actions.reduce((points, action) => points + action.cost, 0) < Game.MAX_ACTION_POINTS) {
        actions.push(new Game.AttackAction(this.candidates[index].position));
        index = (index + 1) % this.candidates.length;
      }
    }
    return actions;
  }
}
