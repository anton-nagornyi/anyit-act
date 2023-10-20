import { Message, RegisterMessage, SuccessMessage } from '@anyit/messaging';
import { MessageHandlers } from '../src/message-handlers';
import { Reason } from '../src/decorators/reason';
import { ReceiveSuccess } from '../src/decorators/receive-success';

describe('Given the ReceiveSuccess decorator', () => {
  describe('When used on a class method argument', () => {
    let someMethod: ReturnType<typeof jest.fn>;

    @RegisterMessage('dummy-message')
    class DummyMessage extends Message {}

    class TestClass {
      someMethod(@ReceiveSuccess message: DummyMessage) {
        someMethod.call(this, this, message);
      }
    }

    beforeEach(() => {
      someMethod = jest.fn();
    });

    it('Then the method should be registered as a message handler based on argument type', () => {
      const handlers = MessageHandlers.getHandlers(
        TestClass,
        SuccessMessage.code,
      );
      expect(handlers).not.toBeNull();
    });

    it('Then the registered handler should invoke the original method', async () => {
      const testInstance = new TestClass();

      const handlers = MessageHandlers.getHandlers(
        TestClass,
        SuccessMessage.code,
      );

      const reason = new DummyMessage();
      const message = new SuccessMessage({
        reason,
      });

      await handlers![0].handleFunction.call(testInstance, message);
      expect(someMethod).toBeCalledWith(testInstance, reason);
    });
  });

  describe('When used on a class method argument with a reason', () => {
    let someMethod: ReturnType<typeof jest.fn>;

    @RegisterMessage('dummy-message')
    class DummyMessage extends Message {}

    class TestClass {
      someMethod(
        @ReceiveSuccess message: DummyMessage,
        @Reason reason: DummyMessage,
      ) {
        someMethod.call(this, this, message, reason);
      }
    }

    beforeEach(() => {
      someMethod = jest.fn();
    });

    it('Then the method should be registered as a message handler based on argument type', () => {
      const handlers = MessageHandlers.getHandlers(
        TestClass,
        SuccessMessage.code,
      );
      expect(handlers).not.toBeNull();
    });

    it('Then the registered handler should invoke the original method', async () => {
      const testInstance = new TestClass();

      const handlers = MessageHandlers.getHandlers(
        TestClass,
        SuccessMessage.code,
      );

      const reason = new DummyMessage();
      const reasonSuccess = new DummyMessage({
        reason,
      });
      const message = new SuccessMessage({
        reason: reasonSuccess,
      });

      await handlers![0].handleFunction.call(testInstance, message);
      expect(someMethod).toBeCalledWith(testInstance, reasonSuccess, reason);
    });
  });
});
