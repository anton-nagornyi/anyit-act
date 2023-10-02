import { LogLevel } from './log-level';

export interface LoggerInterface {
  level: LogLevel;
  debug(message: any, ...meta: any[]): void;
  error(message: any, ...meta: any[]): void;
  fatal(message: any, ...meta: any[]): void;
  info(message: any, ...meta: any[]): void;
  silly(message: any, ...meta: any[]): void;
  warn(message: any, ...meta: any[]): void;
}
