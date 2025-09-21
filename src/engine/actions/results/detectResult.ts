import { assertNotNull } from '../../../utils';
import { ActionResult } from './actionResult';

export class DetectResult extends ActionResult {
  distance: number | null = null;

  get description(): string {
    if (this.isSucceed === false) {
      return this.errorMessage;
    }

    assertNotNull(this.distance);
    return `距离为 ${this.distance}`;
  }
}
