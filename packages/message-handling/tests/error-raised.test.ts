import { ErrorMessage } from '@anyit/messaging';
import { Receive } from '../src/decorators/receive';
import { MessageHandlers } from '../src/message-handlers';
import { ErrorRaised } from '../src/decorators/error-raised';

class TestError extends Error {}

describe('Given the ErrorRaised decorator', () => {
  describe('When used on a class method argument', () => {
    const someMethod = jest.fn();

    class TestClass {
      someMethod(
        @Receive message: ErrorMessage,
        @ErrorRaised error: TestError,
      ) {
        someMethod.call(this, this, message, error);
      }
    }

    beforeEach(() => {
      someMethod.mockReset();
    });

    it('Then the method should be registered as a message handler based on argument type', () => {
      const handlers = MessageHandlers.getHandlers(
        TestClass,
        ErrorMessage.code,
      );
      expect(handlers).not.toBeNull();
    });

    it('Then the reason checker should be registered for the message handler', () => {
      const checkers = MessageHandlers.getReasonChecker(
        TestClass,
        ErrorMessage.code,
      );
      expect(checkers).not.toBeNull();
    });

    it('Then the registered handler should invoke the original method', async () => {
      const testInstance = new TestClass();

      const handlers = MessageHandlers.getHandlers(
        TestClass,
        ErrorMessage.code,
      );

      const error = new TestError();
      const message = new ErrorMessage({ error });
      await handlers![0].handleFunction.call(testInstance, message);

      expect(someMethod).toBeCalledWith(testInstance, message, error);
    });

    it('Then the registered handler should not invoke the original method if reason is not provided', async () => {
      const testInstance = new TestClass();

      const handlers = MessageHandlers.getHandlers(
        TestClass,
        ErrorMessage.code,
      );

      const error = new Error();
      const message = new ErrorMessage({ error });
      await handlers![0].handleFunction(message);
      expect(someMethod).not.toBeCalledWith(testInstance, message, error);
    });
  });
});
