import { assertNotNull } from '../../../utils';
import { ActionResult } from './actionResult';

export class AttackResult extends ActionResult {
  damage: number | null = null;

  get description(): string {
    if (this.isSucceed === false) {
      return this.errorMessage;
    }

    assertNotNull(this.damage);
    if (this.damage <= 0) {
      return '打空了';
    } else {
      return `命中! 造成 ${this.damage} 点伤害`;
    }
  }
}
