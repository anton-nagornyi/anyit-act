export class MissingActorError extends Error {
  constructor(address: string) {
    super(`Actor is missing: ${address}`);
  }

  readonly code = 'MISSING_ACTOR';
}
