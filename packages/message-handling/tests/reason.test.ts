import { Message, RegisterMessage } from '@anyit/messaging';
import { Receive } from '../src/decorators/receive';
import { MessageHandlers } from '../src/message-handlers';
import { Reason } from '../src/decorators/reason';

describe('Given the Reason decorator', () => {
  describe('When used on a class method argument', () => {
    const someMethod = jest.fn();

    @RegisterMessage('dummy-code')
    class DummyMessage extends Message {}

    class TestClass {
      someMethod(@Receive message: DummyMessage, @Reason reason: DummyMessage) {
        someMethod.call(this, this, message, reason);
      }
    }

    beforeEach(() => {
      someMethod.mockReset();
    });

    it('Then the method should be registered as a message handler based on argument type', () => {
      const handlers = MessageHandlers.getHandlers(
        TestClass,
        DummyMessage.code,
      );
      expect(handlers).not.toBeNull();
    });

    it('Then the reason checker should be registered for the message handler', () => {
      const checkers = MessageHandlers.getReasonChecker(
        TestClass,
        DummyMessage.code,
      );
      expect(checkers).not.toBeNull();
    });

    it('Then the registered handler should invoke the original method', async () => {
      const testInstance = new TestClass();

      const handlers = MessageHandlers.getHandlers(
        TestClass,
        DummyMessage.code,
      );

      const reason = new DummyMessage();
      const message = new DummyMessage({ reason });
      await handlers![0].handleFunction.call(testInstance, message);

      expect(someMethod).toBeCalledWith(testInstance, message, reason);
    });

    it('Then the registered handler should not invoke the original method if reason is not provided', async () => {
      const testInstance = new TestClass();

      const handlers = MessageHandlers.getHandlers(
        TestClass,
        DummyMessage.code,
      );

      await handlers![0].handleFunction.call(testInstance, new DummyMessage());
      expect(someMethod).not.toBeCalled();
    });
  });
});
