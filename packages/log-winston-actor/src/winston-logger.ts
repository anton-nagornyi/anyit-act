import * as winston from 'winston';
import { errorFormat } from './formats/error-format';
import { simpleFormat } from './formats/simple-format';

const errorsFormat = errorFormat({ stack: true, cause: true });

/** @internal */
export const WinstonLogger = (args?: winston.LoggerOptions) =>
  winston.createLogger({
    level: 'info',
    format: winston.format.combine(simpleFormat(), errorsFormat),
    silent: false,
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(simpleFormat(), errorsFormat),
      }),
    ],
    ...args,
  });
