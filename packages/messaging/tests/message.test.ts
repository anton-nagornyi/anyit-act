import { DateTime, Settings } from 'luxon';
import { Message } from '../src/messages/message';
import { RegisterMessage } from '../src/decorators/register-message';

Settings.defaultZone = 'utc';

const now = DateTime.utc();
DateTime.utc = () => now;

@RegisterMessage('01H7QJ0CDTC49J6J62JZPHPJKE')
class TestMessage extends Message {}

@RegisterMessage()
class TestMessageWithoutCode extends Message {}

describe('Given the Message class', () => {
  let message: TestMessage;

  describe('When initializing a new TestMessageWithoutCode', () => {
    it('Then its code is equal to the constructor name', () => {
      expect(TestMessageWithoutCode.code).toBe('TestMessageWithoutCode');
    });
  });

  describe('When initializing a new TestMessage', () => {
    describe('And no arguments are provided', () => {
      beforeEach(() => {
        message = new TestMessage();
      });

      it('Then it has a default messageId', () => {
        expect(message.messageId).toBeDefined();
      });

      it('Then it uses current UTC time for createdAt', () => {
        expect(message.createdAt?.toISO()).toEqual(DateTime.utc().toISO());
      });
    });

    describe('And messageId is provided', () => {
      beforeEach(() => {
        message = new TestMessage({ messageId: 'some-uuid' });
      });

      it('Then it uses the provided messageId', () => {
        expect(message.messageId).toBe('some-uuid');
      });
    });

    describe('And createdAt is provided', () => {
      beforeEach(() => {
        message = new TestMessage({ createdAt: '2022-01-01T12:00:00.000Z' });
      });

      it('Then it creates a DateTime object from an ISO string', () => {
        expect(message.createdAt?.toISO()).toEqual('2022-01-01T12:00:00.000Z');
      });
    });

    describe('And traceId is provided', () => {
      beforeEach(() => {
        message = new TestMessage({ traceId: 'some-trace-id' });
      });

      it('Then it uses the provided traceId', () => {
        expect(message.traceId).toBe('some-trace-id');
      });
    });

    describe('And reason is provided as a TestMessage instance', () => {
      let reasonMessage: TestMessage;

      beforeEach(() => {
        reasonMessage = new TestMessage({ messageId: 'reason-uuid' });
        message = new TestMessage({
          reason: reasonMessage,
          traceId: 'some-trace-id',
        });
      });

      it('Then it sets the reason', () => {
        expect(message.reason).toBe(reasonMessage);
      });

      it('Then the reason has the correct messageId', () => {
        expect(message.reason?.messageId).toBe('reason-uuid');
      });

      it('Then the reason has the correct traceId', () => {
        expect(message.traceId).toBe('some-trace-id');
      });
    });

    describe('And reason is provided as an object (not an instance)', () => {
      beforeEach(() => {
        message = new TestMessage({
          reason: new TestMessage({ messageId: 'reason-uuid-from-object' }),
        });
      });

      it('Then it sets the reason', () => {
        expect(message.reason?.messageId).toBe('reason-uuid-from-object');
      });
    });

    describe('And reasonId is provided', () => {
      beforeEach(() => {
        message = new TestMessage({ reasonId: 'some-reason-id' });
      });

      it('Then it uses the provided reasonId', () => {
        expect(message.reasonId).toBe('some-reason-id');
      });
    });
  });

  describe('When calling instance methods of TestMessage', () => {
    beforeEach(() => {
      message = new TestMessage();
    });

    it('Then type attribute returns class name', () => {
      expect(message.type).toBe('TestMessage');
    });

    it('Then toJSON() includes type attribute', () => {
      const json = message.toJSON();
      expect(json.type).toBe('TestMessage');
    });

    it('Then toJSON() includes messageId attribute', () => {
      const json = message.toJSON();
      expect(json.messageId).toBeDefined();
    });

    it('Then toString() matches stringified JSON of the instance', () => {
      expect(message.toString()).toBe(JSON.stringify(message.toJSON()));
    });
  });

  describe('When accessing the code property of TestMessage', () => {
    beforeEach(() => {
      message = new TestMessage();
    });

    it('Then it returns the code set by RegisterMessage decorator', () => {
      expect(message.code).toBe('01H7QJ0CDTC49J6J62JZPHPJKE');
    });
  });
});
