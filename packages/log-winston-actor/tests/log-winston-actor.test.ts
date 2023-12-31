import * as winston from 'winston';
import { SetLogLevel, LogMessage } from '@anyit/log-actor';
import { LogWinstonActor } from '../src/log-winston-actor';
import { WinstonLogger } from '../src/winston-logger';
import { ActorRef, ActorSystem } from '@anyit/actor';

jest.mock('../src/winston-logger');

describe('Given a LogWinstonActor class', () => {
  let mockWinstonLogger: jest.Mocked<winston.Logger>;
  let actor: ActorRef;

  const wait = () => new Promise((resolve) => setTimeout(resolve));

  beforeEach(() => {
    mockWinstonLogger = {
      log: jest.fn(),
      silent: false,
      level: 'info',
    } as any;

    (WinstonLogger as jest.Mock).mockReturnValue(mockWinstonLogger);

    actor = ActorSystem.create(LogWinstonActor, {
      winston: {},
    });
  });

  describe('When setting the log level', () => {
    it('Then it should update the logger level', async () => {
      actor.tell(new SetLogLevel({ logLevel: 'error' }));
      await wait();
      expect(mockWinstonLogger.level).toEqual('error');
      expect(mockWinstonLogger.silent).toEqual(true);
    });

    it('Then it should handle the "silent" log level', () => {
      actor.tell(new SetLogLevel({ logLevel: 'silent' }));
      expect(mockWinstonLogger.silent).toEqual(false);
    });
  });

  describe('When logging a message', () => {
    it('Then it should log the message with the correct level and meta', async () => {
      const message = 'Test message';
      const meta = { some: 'meta' };

      actor.tell(new LogMessage({ message, meta: [meta], level: 'debug' }));
      await wait();
      expect(mockWinstonLogger.log).toBeCalledWith('debug', message, meta);
    });

    it('Then it should handle "fatal" level as "error"', async () => {
      const message = 'Fatal error occurred';
      actor.tell(new LogMessage({ message, level: 'fatal' }));
      await wait();
      expect(mockWinstonLogger.log).toBeCalledWith('error', message);
    });

    it('Then it should handle non-string message correctly', async () => {
      const messageObj = { msg: 'Object Message' };
      actor.tell(new LogMessage({ message: messageObj, level: 'info' }));
      await wait();
      expect(mockWinstonLogger.log).toBeCalledWith('info', '', messageObj);
    });
  });

  describe('When initializing', () => {
    it('Then it should initialize WinstonLogger with the provided options', () => {
      const options = {
        format: winston.format.json(),
        level: 'debug',
      };

      // eslint-disable-next-line no-new
      new LogWinstonActor({ winston: options, address: 'address' });
      expect(WinstonLogger).toBeCalledWith(options);
    });
  });
});
