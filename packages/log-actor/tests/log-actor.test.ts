import { LogActor } from '../src/log-actor';
import { ActorRef, ActorSystem } from '@anyit/actor';
import { SetLogLevel } from '../src/messages/set-log-level';
import { LogMessage } from '../src/messages/log-message';

describe('Given a LogActor', () => {
  let logActor: ActorRef;
  let mockConsoleLog: jest.SpyInstance;
  let mockConsoleWarn: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;
  const wait = () => new Promise((resolve) => setTimeout(resolve));

  beforeEach(() => {
    logActor = ActorSystem.create(LogActor, {
      logLevel: 'info',
    });

    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
    mockConsoleWarn.mockRestore();
    mockConsoleError.mockRestore();
  });

  describe('When receiving a SetLogLevel message', () => {
    beforeEach(async () => {
      logActor.tell(new SetLogLevel({ logLevel: 'error' }));
      await wait();
    });

    describe('And logging info message', () => {
      it('Then it should not output', () => {
        expect(mockConsoleLog).not.toBeCalled();
      });
    });
  });

  describe('When logging a message', () => {
    describe('And log level is set to info', () => {
      beforeEach(async () => {
        logActor.tell(new SetLogLevel({ logLevel: 'info' }));
        await wait();
      });

      it('Then it should not log silly message', async () => {
        logActor.tell(
          new LogMessage({ level: 'silly', message: 'Silly message' }),
        );
        await wait();
        expect(mockConsoleLog).not.toBeCalled();
      });

      it('Then it should not log debug message', async () => {
        logActor.tell(
          new LogMessage({ level: 'debug', message: 'Debug message' }),
        );
        await wait();
        expect(mockConsoleLog).not.toBeCalled();
      });

      it('Then it should log info message', async () => {
        logActor.tell(
          new LogMessage({ level: 'info', message: 'Info message' }),
        );
        await wait();
        expect(mockConsoleLog).toBeCalledWith('Info message');
      });

      it('Then it should log warn message', async () => {
        logActor.tell(
          new LogMessage({ level: 'warn', message: 'Warn message' }),
        );
        await wait();
        expect(mockConsoleWarn).toBeCalledWith('Warn message');
      });

      it('Then it should log error message', async () => {
        logActor.tell(
          new LogMessage({ level: 'error', message: 'Error message' }),
        );
        await wait();
        expect(mockConsoleError).toBeCalledWith('Error message');
      });

      it('Then it should log fatal message', async () => {
        logActor.tell(
          new LogMessage({ level: 'fatal', message: 'Fatal message' }),
        );
        await wait();
        expect(mockConsoleError).toBeCalledWith('Fatal message');
      });
    });
  });

  describe('Given different message and meta combinations', () => {
    const testMessage = 'Test message';
    const testMeta = { data: 'Some meta data' };

    it('Then it should handle only message', async () => {
      logActor.tell(new LogMessage({ level: 'info', message: testMessage }));
      await wait();
      expect(mockConsoleLog).toBeCalledWith(testMessage);
    });

    it('Then it should handle only meta', async () => {
      logActor.tell(new LogMessage({ level: 'info', meta: [testMeta] }));
      await wait();
      expect(mockConsoleLog).toBeCalledWith(testMeta);
    });

    it('Then it should handle message and meta', async () => {
      logActor.tell(
        new LogMessage({
          level: 'info',
          message: testMessage,
          meta: [testMeta],
        }),
      );
      await wait();
      expect(mockConsoleLog).toBeCalledWith(testMessage, testMeta);
    });
  });
});
