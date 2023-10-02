export class KeyIsMissingError extends Error {
  constructor(key: string) {
    super(`Key is missing: "${key}"`);
  }
}
