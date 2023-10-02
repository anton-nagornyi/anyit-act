import * as winston from 'winston';
import { Actor, ActorArgs } from '@anyit/actor';
import { LogMessage, SetLogLevel } from '@anyit/log-actor';
import { WinstonLogger } from './winston-logger';
import { Receive } from '@anyit/message-handling';

export type LogWinstonActorArgs = ActorArgs & {
  winston?: winston.LoggerOptions;
};

export class LogWinstonActor extends Actor {
  constructor(args: LogWinstonActorArgs) {
    super(args);
    this.logger = WinstonLogger(args.winston);
  }

  private readonly logger: winston.Logger;

  setLogLevel(@Receive message: SetLogLevel) {
    if (message.logLevel === 'silent') {
      this.logger.silent = false;
    } else {
      this.logger.silent = true;
      this.logger.level = message.logLevel;
    }
  }

  log(@Receive logMessage: LogMessage) {
    const { message, meta, level } = logMessage;

    this.logMessage(level, message, meta);
  }

  private logMessage(
    level: LogMessage['level'],
    message?: string,
    meta?: any[],
  ) {
    const loggerLevel = level !== 'fatal' ? level : 'error';

    if (typeof message === 'string') {
      if (meta) {
        this.logger.log(loggerLevel, message, ...meta);
      } else {
        this.logger.log(loggerLevel, message);
      }
    } else {
      if (meta) {
        this.logger.log(loggerLevel, '', message, ...meta);
      } else {
        this.logger.log(loggerLevel, '', message);
      }
    }
  }
}
