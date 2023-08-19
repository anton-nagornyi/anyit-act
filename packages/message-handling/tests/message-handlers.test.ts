import { MessageHandlers } from '../src/message-handlers';
import { ErrorMessage, Message, SuccessMessage } from '@anyit/messaging';
import { MessageHandler } from '../src/message-handler';

const createMockHandler = (
  code: string,
  name: string,
  methodName: string,
): MessageHandler => {
  return {
    class: {
      name: 'TestClassName',
      method: methodName,
    },
    message: {
      code,
      name,
    },
    handleFunction: async (
      _: Message,
    ): Promise<void | SuccessMessage | ErrorMessage> => {},
  };
};

describe('Given the MessageHandlers class', () => {
  afterEach(() => {
    jest.resetModules();
  });

  describe('When setting a handler for a specific type and code', () => {
    class TestType {}
    const testHandler = createMockHandler(
      'test-code',
      'TestMessage',
      'testMethod',
    );

    beforeEach(() => {
      MessageHandlers.setHandler(TestType, testHandler);
    });

    it('Then the handler can be retrieved by type and code', () => {
      const handlers = MessageHandlers.getHandlers(TestType, 'test-code');
      expect(handlers).toEqual([testHandler]);
    });

    it('Then the handler can be retrieved by code only', () => {
      const handlers = MessageHandlers.getHandlers('test-code');
      expect(handlers).toEqual(
        expect.arrayContaining([expect.objectContaining(testHandler)]),
      );
    });
  });

  describe('When setting multiple handlers for the same type and code', () => {
    class TestType {}
    const testHandler1 = createMockHandler(
      'test-code',
      'TestMessage1',
      'testMethod1',
    );
    const testHandler2 = createMockHandler(
      'test-code',
      'TestMessage2',
      'testMethod2',
    );

    beforeEach(() => {
      MessageHandlers.setHandler(TestType, testHandler1);
      MessageHandlers.setHandler(TestType, testHandler2);
    });

    it('Then all handlers can be retrieved by type and code', () => {
      const handlers = MessageHandlers.getHandlers(TestType, 'test-code');
      expect(handlers).toEqual([testHandler1, testHandler2]);
    });
  });

  describe('When trying to retrieve a handler for a non-existent type or code', () => {
    it('Then null is returned when using type and code', () => {
      class NonExistentType {}
      const handlers = MessageHandlers.getHandlers(
        NonExistentType,
        'non-existent-code',
      );
      expect(handlers).toBeNull();
    });

    it('Then null is returned when using code only', () => {
      const handlers = MessageHandlers.getHandlers('non-existent-code');
      expect(handlers).toBeNull();
    });
  });
});
