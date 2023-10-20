import { ErrorMessage, Message, RegisterMessage } from '@anyit/messaging';
import { MessageHandlers } from '../src/message-handlers';
import { Reason } from '../src/decorators/reason';
import { ErrorRaised } from '../src/decorators/error-raised';
import { ReceiveFilter } from '../src/decorators/receive-filter';

class TestError extends Error {}

describe('Given the ReceiveFilter decorator', () => {
  describe('When used on a class method argument', () => {
    describe('And only one message type is provided as an argument', () => {
      let someMethod: ReturnType<typeof jest.fn>;

      @RegisterMessage('dummy-message')
      class DummyMessage extends Message {}

      class TestClass {
        @ReceiveFilter(DummyMessage)
        someMethod(message: DummyMessage) {
          someMethod.call(this, message);
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

        await handlers![0].handleFunction.call(
          testInstance,
          new DummyMessage(),
        );
        expect(someMethod).toBeCalled();
      });
    });

    describe('And more than one message type is provided as an argument', () => {
      let someMethod: ReturnType<typeof jest.fn>;

      @RegisterMessage('dummy-message')
      class DummyMessage extends Message {}

      @RegisterMessage('dummy-message-2')
      class DummyMessage2 extends Message {}

      class TestClass {
        @ReceiveFilter(DummyMessage, DummyMessage2)
        someMethod(message: DummyMessage) {
          someMethod.call(this, message);
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

      it('Then the registered handler should invoke the original method for the DummyMessage', async () => {
        const testInstance = new TestClass();

        const handlers = MessageHandlers.getHandlers(
          TestClass,
          DummyMessage.code,
        );

        await handlers![0].handleFunction.call(
          testInstance,
          new DummyMessage(),
        );
        expect(someMethod).toBeCalledTimes(1);
      });

      it('Then the registered handler should invoke the original method for the DummyMessage2', async () => {
        const testInstance = new TestClass();

        const handlers = MessageHandlers.getHandlers(
          TestClass,
          DummyMessage2.code,
        );

        await handlers![0].handleFunction.call(
          testInstance,
          new DummyMessage2(),
        );
        expect(someMethod).toBeCalledTimes(1);
      });
    });
  });

  describe('When used on a class method argument with a reason and an error', () => {
    let someMethod: ReturnType<typeof jest.fn>;

    @RegisterMessage('dummy-message')
    class DummyMessage extends Message {}

    class TestClass {
      @ReceiveFilter({ messageTypes: [ErrorMessage], parameterIndex: 2 })
      someMethod(
        @Reason reason: DummyMessage,
        @ErrorRaised error: TestError,
        message: ErrorMessage,
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
