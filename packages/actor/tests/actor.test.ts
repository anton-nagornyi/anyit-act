import { Actor } from '../src/actor';
import { Subscribe } from '../src/messages/subscribe';
import { ActorRef } from '../src/actor-ref';
import { ActorSystem } from '../src/actor-system';
import { Message, RegisterMessage } from '@anyit/messaging';

class TestActor extends Actor {}

@RegisterMessage('01HBN0K9K9A2HEB918MY0JA85Q')
class TestMessage extends Message {}

describe('Actor', () => {
  let actor: Actor;
  let ref: ActorRef;
  let testRef: ActorRef;

  beforeEach(() => {
    ref = ActorSystem.create(Actor);
    actor = (ref as any).transmitter.resolver.resolve(ref.address);
    testRef = ActorSystem.create(TestActor);
  });

  describe('handleMessage', () => {
    it('Then it should emit a success message if handled correctly', async () => {
      const mockMessage = { code: 'mockCode' };
      jest.spyOn(actor as any, 'emitToListeners');

      await (actor as any).handleMessage(mockMessage);

      expect((actor as any).emitToListeners).toHaveBeenCalled();
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

    it('Then it should subscribe to specific message types', () => {
      const subscribeMessage = new Subscribe({
        listener: testRef,
        messageTypes: [TestMessage],
      });

      ref.tell(subscribeMessage);

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
