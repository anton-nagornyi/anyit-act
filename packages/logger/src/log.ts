import { ActorRef, ActorSystem } from '@anyit/actor';
import { LogActor, LogMessage, SetLogLevel } from '@anyit/log-actor';
import { StaticLoggerInterface, LogLevel } from '@anyit/logger-interface';

@StaticLoggerInterface
export class Log {
  private static actor?: ActorRef;

  static readonly LOGGER_ADDRESS = 'logger-01HAVBM8KV02XWY2GJ9ANKH9B3';

  static get level(): LogLevel {
    return this.logLevel;
  }

  static set level(value: LogLevel) {
    this.logLevel = value;
    this.actor?.tell(
      new SetLogLevel({
        logLevel: value,
      }),
    );
  }

  private static logLevel: LogLevel = 'info';

  static debug(message: any, ...meta: any[]): void {
    this.getLogger().tell(
      new LogMessage({
        message,
        meta,
        level: 'debug',
      }),
    );
  }

  static error(message: any, ...meta: any[]): void {
    this.getLogger().tell(
      new LogMessage({
        message,
        meta,
        level: 'error',
      }),
    );
  }

  static fatal(message: any, ...meta: any[]): void {
    this.getLogger().tell(
      new LogMessage({
        message,
        meta,
        level: 'fatal',
      }),
    );
  }

  static info(message: any, ...meta: any[]): void {
    this.getLogger().tell(
      new LogMessage({
        message,
        meta,
        level: 'info',
      }),
    );
  }

  static silly(message: any, ...meta: any[]): void {
    this.getLogger().tell(
      new LogMessage({
        message,
        meta,
        level: 'silly',
      }),
    );
  }

  static warn(message: any, ...meta: any[]): void {
    this.getLogger().tell(
      new LogMessage({
        message,
        meta,
        level: 'warn',
      }),
    );
  }

  private static getLogger() {
    if (!this.actor) {
      this.actor =
        ActorSystem.resolve(this.LOGGER_ADDRESS) ??
        ActorSystem.create(LogActor, {
          logLevel: this.logLevel,
          address: this.LOGGER_ADDRESS,
        });
    }
    return this.actor;
  }
}
