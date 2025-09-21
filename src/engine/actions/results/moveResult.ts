import { ActionResult } from './actionResult';
import type { Position } from '../../types';
import { assertNotNull, positionText } from '../../../utils';

export class MoveResult extends ActionResult {
  position: Position | null = null;

  get description(): string {
    if (this.isSucceed === false) {
      return this.errorMessage;
    }

    assertNotNull(this.position);
    return `移动到了位置 ${positionText(this.position)}`;
  }
}
