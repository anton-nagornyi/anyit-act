import { ErrorMessage, Message, RegisterMessage } from '@anyit/messaging';
import { Receive } from '../src/decorators/receive';
import { MessageHandlers } from '../src/message-handlers';
import { Reason } from '../src/decorators/reason';
import { ErrorRaised } from '../src/decorators/error-raised';

class TestError extends Error {}

describe('Given the Receive decorator', () => {
  describe('When used on a class method argument', () => {
    let someMethod: ReturnType<typeof jest.fn>;

    @RegisterMessage('dummy-message')
    class DummyMessage extends Message {}

    class TestClass {
      someMethod(@Receive message: DummyMessage) {
        someMethod.call(this, this, message);
      }
    }

    beforeEach(() => {
      someMethod = jest.fn();
    });

    it('Then the method should be registered as a message handler based on argument type', () => {
      const handlers = MessageHandlers.getHandlers(
        TestClass,
        DummyMessage.code,
      );
      expect(handlers).not.toBeNull();
    });

    it('Then the registered handler should invoke the original method', async () => {
      const testInstance = new TestClass();

      const handlers = MessageHandlers.getHandlers(
        TestClass,
        DummyMessage.code,
      );

      const message = new DummyMessage();

      await handlers![0].handleFunction.call(testInstance, message);
      expect(someMethod).toBeCalledWith(testInstance, message);
    });
  });

  describe('When used on a class method argument with a reason and an error', () => {
    let someMethod: ReturnType<typeof jest.fn>;

    @RegisterMessage('dummy-message')
    class DummyMessage extends Message {}

    class TestClass {
      someMethod(
        @Receive message: ErrorMessage,
        @Reason reason: DummyMessage,
        @ErrorRaised error: TestError,
      ) {
        someMethod.call(this, this, message, reason, error);
      }
    }

    beforeEach(() => {
      someMethod = jest.fn();
    });

    it('Then the method should be registered as a message handler based on argument type', () => {
      const handlers = MessageHandlers.getHandlers(
        TestClass,
        ErrorMessage.code,
      );
      expect(handlers).not.toBeNull();
    });

    it('Then the registered handler should invoke the original method', async () => {
      const testInstance = new TestClass();

      const handlers = MessageHandlers.getHandlers(
        TestClass,
        ErrorMessage.code,
      );

      const reason = new DummyMessage();
      const error = new TestError();
      const errorMessage = new ErrorMessage({
        reason,
        error,
      });

      await handlers![0].handleFunction.call(testInstance, errorMessage);
      expect(someMethod).toBeCalledWith(
        testInstance,
        errorMessage,
        reason,
        error,
      );
    });
  });
});
