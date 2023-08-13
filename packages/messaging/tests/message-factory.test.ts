import { Message } from '../src/messages/message';
import { MessageFactory } from '../src/message-factory';
import { MessageDeserializeError } from '../src/errors/message-deserialize-error';

describe('Given the MessageFactory class', () => {
  // Mock message class and its subtype for testing
  class MockMessage extends Message {}
  class AnotherMockMessage extends Message {}

  describe('When registering message types', () => {
    beforeEach(() => {
      MessageFactory.register('mockCode', MockMessage);
    });

    it('Then getMessageType retrieves the correct message type by code', () => {
      const retrievedType = MessageFactory.getMessageType('mockCode');
      expect(retrievedType).toBe(MockMessage);
    });

    describe('And registering another message type', () => {
      beforeEach(() => {
        MessageFactory.register('anotherMockCode', AnotherMockMessage);
      });

      it('Then getMessageType retrieves the new message type by code', () => {
        const retrievedType = MessageFactory.getMessageType('anotherMockCode');
        expect(retrievedType).toBe(AnotherMockMessage);
      });
    });
  });

  describe('When creating messages from input', () => {
    beforeEach(() => {
      MessageFactory.register('mockCode', MockMessage);
    });

    it('Then it returns an instance of the correct class', () => {
      const instance = MessageFactory.create({ code: 'mockCode' });
      expect(instance).toBeInstanceOf(MockMessage);
    });

    it('Then it throws an error for unknown message types', () => {
      expect(() => {
        MessageFactory.create({ code: 'unknownCode' });
      }).toThrow(MessageDeserializeError);
    });
  });
});
