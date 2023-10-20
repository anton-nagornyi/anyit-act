import { ErrorMessage, Message, RegisterMessage } from '@anyit/messaging';
import { MessageHandlers } from '../src/message-handlers';
import { Reason } from '../src/decorators/reason';
import { Receive } from '../src/decorators/receive';
import { ErrorRaisedFilter } from '../src/decorators/error-raised-filter';

class TestError extends Error {}

describe('Given the ErrorRaisedFilter decorator', () => {
  describe('When used on a class method argument', () => {
    describe('And only one error type is provided as an argument', () => {
      let someMethod: ReturnType<typeof jest.fn>;

      class TestClass {
        @ErrorRaisedFilter(TestError)
        someMethod(@Receive message: ErrorMessage) {
          someMethod.call(this, this, message);
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

        const message = new ErrorMessage({
          error: new TestError(),
        });

        await handlers![0].handleFunction.call(testInstance, message);
        expect(someMethod).toBeCalledWith(testInstance, message);
      });
    });

    describe('And more than one error type is provided as an argument', () => {
      let someMethod: ReturnType<typeof jest.fn>;

      class TestError2 extends Error {}

      class TestClass {
        @ErrorRaisedFilter(TestError, TestError2)
        someMethod(
          @Receive message: ErrorMessage,
          _: any,
          error: TestError | TestError2,
        ) {
          someMethod.call(this, this, message, error);
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

      it('Then the registered handler should invoke the original method for the TestError', async () => {
        const testInstance = new TestClass();

        const handlers = MessageHandlers.getHandlers(
          TestClass,
          ErrorMessage.code,
        );

        const error = new TestError();
        const message = new ErrorMessage({
          error,
        });
        await handlers![0].handleFunction.call(testInstance, message);
        expect(someMethod).toBeCalledWith(testInstance, message, error);
      });

      it('Then the registered handler should invoke the original method for the TestError2', async () => {
        const testInstance = new TestClass();

        const handlers = MessageHandlers.getHandlers(
          TestClass,
          ErrorMessage.code,
        );

        const error = new TestError2();
        const message = new ErrorMessage({
          error,
        });

        await handlers![0].handleFunction.call(testInstance, message);
        expect(someMethod).toBeCalledWith(testInstance, message, error);
      });
    });
  });

  describe('When used on a class method argument with a reason and an error', () => {
    let someMethod: ReturnType<typeof jest.fn>;

    @RegisterMessage('dummy-message')
    class DummyMessage extends Message {}

    class TestClass {
      @ErrorRaisedFilter({ errors: [TestError], parameterIndex: 2 })
      someMethod(
        @Receive message: ErrorMessage,
        @Reason reason: DummyMessage,
        error: TestError,
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
