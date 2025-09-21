import { ActionResult } from './actionResult';

export class SkipResult extends ActionResult {
  get description(): string {
    return '行动点数不足，跳过!';
  }
}
