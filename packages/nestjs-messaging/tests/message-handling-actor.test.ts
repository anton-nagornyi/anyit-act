import { ActorRef, ActorSystem, Subscribe } from '@anyit/actor';
import {
  SuccessMessage,
  ProcessingComplete,
  ErrorMessage,
  Message,
  RegisterMessage,
} from '@anyit/messaging';
import { DeleteKey, Pattern } from '@anyit/key-value-actor';
import { Receive } from '@anyit/message-handling';
import { MessageHandlingActor } from '../src/message-handling-actor';

@RegisterMessage('01HARSKFYN4WZZNS45NG7YJRAF')
class TestMessage extends Message {
  constructor(readonly payload: string) {
    super();
  }
}

const mockHandler = jest.fn();

class Test {
  testHandler1(@Receive message: TestMessage) {
    return mockHandler(message);
  }
}

describe('Given a MessageHandlingActor', () => {
  let actor: ActorRef;
  let mockKeyValueActor: any;
  let mockWireActor: any;

  beforeEach(() => {
    mockKeyValueActor = {
      tell: jest.fn(),
    };
    mockWireActor = {
      tell: jest.fn(),
    };

    actor = ActorSystem.create(MessageHandlingActor, {
      keyValue: mockKeyValueActor,
      wire: mockWireActor,
      keyPrefix: 'mockPrefix',
    });
  });

  describe('When the actor is started', () => {
    it('Then it should subscribe to the wire actor for SuccessMessage messages', () => {
      expect(mockWireActor.tell).toBeCalledWith(
        expect.objectContaining({
          code: Subscribe.code,
          messageTypes: [SuccessMessage],
        }),
      );
    });
  });

  describe('When handling a message', () => {
    describe('When the message is a success and the reason is processing complete', () => {
      const successMessage = new SuccessMessage({
        reason: new ProcessingComplete({}),
        messageId: '12345',
      });

      beforeEach(() => {
        actor.tell(successMessage);
      });

      it('Then the key based on messageId and prefix should be deleted from the key-value actor', () => {
        expect(mockKeyValueActor.tell).toBeCalledWith(
          expect.objectContaining({
            code: DeleteKey.code,
            key: 'mockPrefix*12345',
            pattern: Pattern.glob,
          }),
        );
      });
    });

    describe('When the message has handlers', () => {
      let mockMessage: TestMessage;

      beforeEach(() => {
        mockMessage = new TestMessage('test-payload');

        // eslint-disable-next-line no-new
        new Test();
        mockHandler.mockReset();

        actor.tell(mockMessage);
      });

      it('Then it should call the handlers for the message', () => {
        expect(mockHandler).toBeCalledWith(mockMessage);
      });

      describe('And the handler returns a success or error message', () => {
        beforeEach(() => {
          mockHandler.mockReset();
          mockWireActor.tell.mockReset();
          mockHandler.mockResolvedValueOnce(new SuccessMessage({}));
          actor.tell(mockMessage);
        });

        it('Then the wire actor should be informed with the result', () => {
          expect(mockWireActor.tell).toBeCalledWith(
            expect.objectContaining({
              code: SuccessMessage.code,
            }),
          );
        });
      });

      describe('And the handler throws an error', () => {
        beforeEach(() => {
          mockHandler.mockReset();
          mockHandler.mockRejectedValueOnce(new Error('mockError'));
          mockWireActor.tell.mockReset();
          actor.tell(mockMessage);
        });

        it('Then the wire actor should receive an ErrorMessage', () => {
          expect(mockWireActor.tell).toBeCalledWith(
            expect.objectContaining({
              code: ErrorMessage.code,
            }),
          );
        });
      });

      it('Then the wire actor should be informed that processing is complete', () => {
        expect(mockWireActor.tell).toHaveBeenCalledWith(
          expect.objectContaining({
            code: ProcessingComplete.code,
            reason: mockMessage,
          }),
        );
      });
    });
  });
});
