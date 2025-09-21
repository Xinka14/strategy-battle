export abstract class ActionResult {
  exception: Error | null = null;

  abstract get description(): string;

  get isSucceed(): boolean {
    return this.exception === null;
  }

  get errorMessage(): string {
    return `行动失败 (${this.exception?.message})`;
  }
}
