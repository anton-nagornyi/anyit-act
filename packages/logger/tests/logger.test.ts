import { ActorRef, ActorSystem } from '@anyit/actor';
import { Log } from '../src/log';
import { LogLevel } from '@anyit/logger-interface';

describe('Given a Log class', () => {
  let mockActor: ActorRef;
  let mockTell: jest.Mock;

  beforeAll(() => {
    mockActor = {} as ActorRef;
    mockTell = jest.fn();
    mockActor.tell = mockTell;

    ActorSystem.create = jest.fn().mockReturnValue(mockActor);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When setting the log level', () => {
    it('Then it should correctly update its log level and send a SetLogLevel message to the actor', () => {
      Log.level = 'error';
      expect(Log.level).toEqual('error');
    });
  });

  const testCases = [
    { method: 'debug', level: 'debug' },
    { method: 'error', level: 'error' },
    { method: 'fatal', level: 'fatal' },
    { method: 'info', level: 'info' },
    { method: 'silly', level: 'silly' },
    { method: 'warn', level: 'warn' },
  ] as {
    method: Exclude<keyof typeof Log, 'LOGGER_ADDRESS' | 'level' | 'prototype'>;
    level: LogLevel;
  }[];

  testCases.forEach((testCase) => {
    describe(`When logging a ${testCase.method} message`, () => {
      it(`Then it should send a ${testCase.level} LogMessage to the actor`, () => {
        const message = `Test ${testCase.level} message`;
        const meta = { some: 'meta' };

        Log[testCase.method](message, meta);
        expect(mockTell).toHaveBeenCalledWith(
          expect.objectContaining({
            message,
            meta: [meta],
            level: testCase.level,
          }),
        );
      });
    });
  });
});
