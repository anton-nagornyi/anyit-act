import { LoggerInterface } from './logger-interface';
import { LogLevel } from './log-level';

export class SilentLogger implements LoggerInterface {
  readonly level: LogLevel = 'silent';

  debug(): void {}

  error(): void {}

  fatal(): void {}

  info(): void {}

  silly(): void {}

  warn(): void {}
}
