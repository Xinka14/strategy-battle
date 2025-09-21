import { MAX_ROUNDS } from '../constants';
import { getOpponent } from '../utils';
import type { Player } from './player';
import { RoundHistory } from './histories/roundHistory';
import { TurnHistory } from './histories/turnHistory';
import { PublicState } from './publicState';

export class Game {
  no: number;
  players: Player[];
  currentRound: number = 1;
  roundHistories: RoundHistory[] = [];
  isFinished: boolean = false;
  winner: Player | null = null;

  constructor(no: number, players: [Player, Player]) {
    this.no = no;
    this.players = players;

    // 重置玩家状态，随机位置
    this.players.forEach((player) => player.reset());

    // 开始回合
    while (this.isFinished === false && this.currentRound <= MAX_ROUNDS) {
      this.playRound();
      this.currentRound += 1;
    }

    this.isFinished = true;
  }

  get result() {
    return {
      text: this.isFinished === false ? '正在进行...' : this.winner === null ? '平局' : `${this.winner.name}获胜`,
    };
  }

  playRound() {
    const history = new RoundHistory(this.currentRound);
    this.roundHistories.push(history);

    for (const player of this.players) {
      this.playTurn(player, history);
    }
  }

  playTurn(player: Player, roundHistory: RoundHistory) {
    const turnHistory = new TurnHistory(player);
    roundHistory.addTurnHistory(turnHistory);

    if (this.isFinished === true) {
      return;
    }

    // 获取公开状态
    const state = this.getPublicStateForPlayer(player);
    // 决定行动
    const actions = player.strategy.getActions(state);

    let usedPoints = 0;
    for (const action of actions) {
      // 执行行动
      usedPoints += action.tryExecute(usedPoints, player, this);
      turnHistory.addAction(action);

      // 判定胜负
      const loser = this.players.find((p) => p.isDead);
      if (loser !== undefined) {
        this.isFinished = true;
        this.winner = getOpponent(this.players, loser);
        break;
      }
    }
  }

  getPublicStateForPlayer(player: Player): PublicState {
    const opponent = getOpponent(this.players, player);
    return new PublicState(this.currentRound, player, opponent, this.roundHistories);
  }
}
