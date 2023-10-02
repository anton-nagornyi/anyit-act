import { Actor, ActorRef, ActorSystem } from '@anyit/actor';
import { Subscribe } from '@anyit/actor';
import { Message, ProcessingComplete, RegisterMessage } from '@anyit/messaging';
import { WireActor, WireActorArgs } from '../src/wire-actor';

const receive = jest.fn();

class TestActor extends Actor {
  protected async handleMessage(message: Message): Promise<void> {
    receive(message);
    return super.handleMessage(message);
  }
}

@RegisterMessage('01H9ZFY42XWPQY1XCA1YPBFKV1')
class TestMessage extends Message {
  constructor(readonly payload: string) {
    super();
  }
}

describe('Given a WireActor', () => {
  let wireActor: ActorRef<WireActor>;
  let writerActorRef: ActorRef;
  let readersActorRef: ActorRef[];

  beforeEach(() => {
    writerActorRef = ActorSystem.create(Actor);
    readersActorRef = [ActorSystem.create(Actor), ActorSystem.create(Actor)];

    const args: WireActorArgs = {
      address: 'some-address',
      writer: writerActorRef,
      readers: readersActorRef,
    };

    wireActor = ActorSystem.create(WireActor, args);
  });

  describe('When receiving a Subscribe message', () => {
    let mockMessage: Subscribe;
    let listener: ActorRef;

    beforeEach(() => {
      receive.mockReset();
      listener = ActorSystem.create(TestActor);
      mockMessage = new Subscribe({
        listener,
      });
      wireActor.tell(mockMessage);
    });

    it('Then it should forward the message to all readers', () => {
      expect(receive).toHaveBeenNthCalledWith(1, mockMessage);
      expect(receive).toHaveBeenNthCalledWith(2, mockMessage);
    });
  });

  describe('When receiving a ProcessingComplete message', () => {
    let mockMessage: Message;
    let listener: ActorRef;

    beforeEach(() => {
      mockMessage = new ProcessingComplete();
      listener = ActorSystem.create(TestActor);
      writerActorRef.tell(
        new Subscribe({
          listener,
          messageTypes: [ProcessingComplete],
        }),
      );

      wireActor.tell(
        new Subscribe({
          listener,
          messageTypes: [ProcessingComplete],
        }),
      );

      receive.mockReset();
      wireActor.tell(mockMessage);
    });

    it('Then it should forward the message to all readers', () => {
      expect(receive).toHaveBeenNthCalledWith(1, mockMessage);
      expect(receive).toHaveBeenNthCalledWith(2, mockMessage);
    });
  });

  describe('When receiving a regular Message', () => {
    let mockMessage: Message;
    let listener: ActorRef;

    beforeEach(() => {
      mockMessage = new TestMessage('test-payload');
      listener = ActorSystem.create(TestActor);
      writerActorRef.tell(
        new Subscribe({
          listener,
          messageTypes: [TestMessage],
        }),
      );

      wireActor.tell(
        new Subscribe({
          listener,
          messageTypes: [TestMessage],
        }),
      );

      receive.mockReset();
      wireActor.tell(mockMessage);
    });

    it('Then it should forward the message to the writer', () => {
      expect(receive).toHaveBeenNthCalledWith(1, mockMessage);
    });

    it('Then it should not forward the message to all readers', () => {
      expect(receive).toBeCalledTimes(1);
    });
  });
});
