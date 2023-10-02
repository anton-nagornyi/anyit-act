import { LoggerInterface } from './logger-interface';

const staticImplements =
  <T>() =>
  <U extends T>(constructor: U) =>
    constructor;

export const StaticLoggerInterface = staticImplements<LoggerInterface>();
