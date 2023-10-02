import { Actor, ActorArgs } from '@anyit/actor';
import { LogMessage } from './messages/log-message';
import { Receive } from '@anyit/message-handling';
import { SetLogLevel } from './messages/set-log-level';
import { LogLevel } from '@anyit/logger-interface';

const LogLevelId: Record<LogLevel, number> = {
  silent: 0,
  silly: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5,
  fatal: 6,
};

export type LogActorArgs = ActorArgs & {
  logLevel: LogLevel;
};

export class LogActor extends Actor {
  constructor(args: LogActorArgs) {
    super(args);

    this.logLevelId = LogLevelId[args.logLevel];
  }

  private logLevelId: number;

  setLogLevel(@Receive message: SetLogLevel) {
    this.logLevelId = LogLevelId[message.logLevel];
  }

  async log(@Receive logMessage: LogMessage) {
    if (this.logLevelId === 0) {
      return;
    }

    const { message, meta } = logMessage;

    const messageLogLevelId = LogLevelId[logMessage.level];

    if (messageLogLevelId < this.logLevelId) {
      return;
    }

    switch (logMessage.level) {
      case 'silly':
      case 'info':
      case 'debug':
        this.logMessage('log', message, meta);
        break;
      case 'warn':
        this.logMessage('warn', message, meta);
        break;
      case 'error':
      case 'fatal':
        this.logMessage('error', message, meta);
        break;
    }
  }

  private logMessage(
    method: 'log' | 'warn' | 'error',
    message?: string,
    meta?: any[],
  ) {
    if (message && meta) {
      console[method](message, ...meta);
    } else if (message) {
      console[method](message);
    } else if (meta) {
      console[method](...meta);
    }
  }
}
