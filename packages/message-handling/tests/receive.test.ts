import { Message } from '@anyit/messaging';
import { Receive } from '../src/decorators/receive';
import { MessageHandlers } from '../src/message-handlers';

describe('Given the Receive decorator', () => {
  describe('When used on a class method argument', () => {
    let someMethod: ReturnType<typeof jest.fn>;

    class DummyMessage extends Message {
      static code = 'dummy-code';
    }

    class TestClass {
      someMethod(@Receive message: DummyMessage) {
        someMethod.call(message);
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

    it('Then the registered handler should invoke the original method', () => {
      new TestClass();

      const handlers = MessageHandlers.getHandlers(
        TestClass,
        DummyMessage.code,
      );

      handlers![0].handleFunction(new DummyMessage());
      expect(someMethod).toHaveBeenCalled();
    });
  });
});
