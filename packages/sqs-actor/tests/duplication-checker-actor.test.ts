import { Actor, ActorRef, ActorSystem } from '@anyit/actor';
import {
  KeyValueActor,
  GetValueSuccess,
  GetValue,
} from '@anyit/key-value-actor';
import { Subscribe } from '@anyit/actor';
import { DuplicationCheckerActor } from '../src/actors/duplication-checker-actor';
import { ErrorMessage, Message, RegisterMessage } from '@anyit/messaging';
import { HandleSqsMessageSuccess } from '../src/messages/handle-sqs-message-success';
import { MessageIsAlreadyReceived } from '../src/errors/message-is-already-received';

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('random-uuid'),
}));

const handleMessage = jest.fn();
class TestActor extends Actor {
  async handleMessage(message: Message) {
    handleMessage(message);
  }
}

@RegisterMessage('01H92M2B632SX5KMCS08H14VR2')
class TestReceivedMessage extends Message {
  constructor(readonly payload: string) {
    super();
  }
}

describe('Given a DuplicationCheckerActor', () => {
  let actor: DuplicationCheckerActor;
  let keyValueRef: ActorRef<KeyValueActor>;
  let testActorRef: ActorRef<TestActor>;

  beforeEach(() => {
    handleMessage.mockReset();
    keyValueRef = ActorSystem.create(KeyValueActor, {});
    actor = new DuplicationCheckerActor({
      address: 'test-address',
      keyValue: keyValueRef,
    });
    testActorRef = ActorSystem.create(TestActor);
    actor.tell(new Subscribe({ listener: testActorRef }));
    keyValueRef.tell(new Subscribe({ listener: testActorRef }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When the actor is started', () => {
    let ref: ActorRef;

    beforeEach(async () => {
      ref = ActorSystem.getRef(actor.address);
      actor.start(ref);
    });

    it('Then it should subscribe to necessary messages', () => {
      // Verify the handleMessage call.
      expect(handleMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          listener: expect.objectContaining({
            address: ref.address,
          }),
          messageTypes: [ErrorMessage, GetValueSuccess],
        }),
      );
    });
  });

  describe('When handleSqsMessageSuccess is invoked', () => {
    let mockMessage: HandleSqsMessageSuccess;

    beforeEach(() => {
      mockMessage = new HandleSqsMessageSuccess({
        traceId: 'trace-123',
        messageId: 'msg-123',
        receivedMessage: new TestReceivedMessage('test-payload'),
      });
      actor.handleSqsMessageSuccess(mockMessage);
    });

    it('Then it should request key value', () => {
      expect(handleMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          code: GetValue.code,
          traceId: 'trace-123',
          reason: expect.objectContaining(mockMessage),
          key: `random-uuid:msg-123`,
        }),
      );
    });
  });

  describe('When getValueFail is invoked', () => {
    let mockErrorMessage: ErrorMessage;
    let mockMessage: HandleSqsMessageSuccess;

    beforeEach(() => {
      mockMessage = new HandleSqsMessageSuccess({
        traceId: 'trace-123',
        messageId: 'msg-123',
        receivedMessage: new TestReceivedMessage('test-payload'),
      });
      mockErrorMessage = new ErrorMessage({
        reason: new GetValue({ key: 'key', reason: mockMessage }),
        traceId: 'trace-123',
        error: new Error('test-error'),
      });
      actor.getValueFail(mockErrorMessage);
    });

    it('Then it should emit the original message to listeners', () => {
      expect(handleMessage).toHaveBeenCalledWith(mockMessage);
    });
  });

  describe('When getValueSuccess is invoked', () => {
    let mockGetValueSuccess: GetValueSuccess;
    let mockMessage: HandleSqsMessageSuccess;

    beforeEach(() => {
      mockMessage = new HandleSqsMessageSuccess({
        traceId: 'trace-123',
        messageId: 'msg-123',
        receivedMessage: new TestReceivedMessage('test-payload'),
      });
      mockGetValueSuccess = new GetValueSuccess({
        traceId: 'trace-123',
        reason: mockMessage,
        key: 'key',
        value: 'value',
      });
      actor.getValueSuccess(mockGetValueSuccess);
    });

    it('Then it should emit an error message indicating the message is already received', () => {
      expect(handleMessage).toHaveBeenCalledWith(
        expect.objectContaining(
          new ErrorMessage({
            traceId: 'trace-123',
            reason: mockMessage,
            error: new MessageIsAlreadyReceived('msg-123'),
          }),
        ),
      );
    });
  });
});
