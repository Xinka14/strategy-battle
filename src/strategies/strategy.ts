import type { PublicState } from '../engine/publicState';
import type { Action } from '../engine/types';

export interface Strategy {
  name: string;
  description: string;
  reset(): void;
  getActions(state: PublicState): Action[];
}
