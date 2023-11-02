import { Actor } from '../src/actor';
import { Subscribe } from '../src/messages/subscribe';
import { ActorRef } from '../src/actor-ref';
import { ActorSystem } from '../src/actor-system';
import { Message, RegisterMessage, SuccessMessage } from '@anyit/messaging';
import { Receive } from '@anyit/message-handling';
import { AskNoHandlerError } from '../src/errors/ask-no-handler-error';
import { AskTimeoutError } from '../src/errors/ask-timeout-error';

@RegisterMessage('01HBN0K9K9A2HEB918MY0JA85Q')
class TestMessage extends Message {}

@RegisterMessage('01HE7GX2H2NTDMXZD11BTDHZQ1')
class TestMessage1 extends Message {}

class TestActor extends Actor {
  testMessage(@Receive _: TestMessage) {}
}

class TestTimeourActor extends Actor {
  testMessage(@Receive _: TestMessage) {
    return new Promise((resolve) => setTimeout(resolve, 1));
  }
}

describe('Actor', () => {
  let actor: Actor;
  let ref: ActorRef;
  let refTimeout: ActorRef;
  let testRef: ActorRef;

  beforeEach(() => {
    ref = ActorSystem.create(TestActor);
    refTimeout = ActorSystem.create(TestTimeourActor, {
      address: 'address',
      askTimeout: 0,
    });
    actor = (ref as any).transmitter.resolver.resolve(ref.address);
    testRef = ActorSystem.create(TestActor);
  });

  describe('handleMessage', () => {
    it('Then it should emit a success message if handled correctly', async () => {
      const mockMessage = new TestMessage();
      jest.spyOn(actor as any, 'emitToListeners');

      await (actor as any).handleMessage(mockMessage);

      expect((actor as any).emitToListeners).toBeCalledWith(
        expect.objectContaining({
          code: SuccessMessage.code,
          reason: mockMessage,
        }),
      );
    });
  });

  describe('subscribe', () => {
    it('Then it should not subscribe if listener tries to listen to itself', () => {
      const subscribeMessage = new Subscribe({
        listener: ref,
      });

      ref.tell(subscribeMessage);

      expect((actor as any).everythingListeners.size).toBe(0);
    });

    it('Then it should subscribe to specific message types', async () => {
      const subscribeMessage = new Subscribe({
        listener: testRef,
        messageTypes: [TestMessage],
      });

      ref.tell(subscribeMessage);

      await new Promise((resolve) => setTimeout(resolve, 1));
      const listeners = (actor as any).listeners.get(
        '01HBN0K9K9A2HEB918MY0JA85Q',
      );
      expect(listeners?.size).toBe(1);
    });
  });

  describe('tell', () => {
    it('Then it should add message to the inbox and process it', () => {
      const mockMessage = new TestMessage();

      jest.spyOn(actor as any, 'process').mockImplementation();

      ref.tell(mockMessage);

      expect((actor as any).inbox[0]).toBe(mockMessage);
      expect((actor as any).process).toHaveBeenCalled();
    });
  });

  describe('ask', () => {
    it('Then it should successfully process the message', async () => {
      const mockMessage = new TestMessage();

      await expect(ref.ask(mockMessage)).resolves.toMatchObject({
        response: expect.objectContaining({
          code: SuccessMessage.code,
          reason: mockMessage,
        }),
        reason: mockMessage,
      });
    });

    it('Then it should throw AskTimeoutError', async () => {
      const mockMessage = new TestMessage();

      await expect(refTimeout.ask(mockMessage)).rejects.toThrow(
        AskTimeoutError,
      );
    });

    it('Then it should throw AskNoHandlerError', async () => {
      await expect(ref.ask(new TestMessage1())).rejects.toThrow(
        AskNoHandlerError,
      );
    });
  });

  describe('emitToListeners', () => {
    it('Then it should send message to all listeners', () => {
      const mockListener = { address: 'listenerAddress', tell: jest.fn() };
      const mockMessage = { code: 'mockCode' };
      (actor as any).everythingListeners.add(mockListener);

      (actor as any).emitToListeners(mockMessage);

      expect(mockListener.tell).toHaveBeenCalledWith(mockMessage);
    });
  });
});
