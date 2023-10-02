import { Actor, ActorRef, ActorSystem, Subscribe } from '@anyit/actor';
import {
  Message,
  ProcessingComplete,
  RegisterMessage,
  SuccessMessage,
} from '@anyit/messaging';
import { SqsActor } from '../src/actors/sqs-actor';
import { StartPolling } from '../src/messages/start-polling';
import { StopPolling } from '../src/messages/stop-polling';

const send = jest.fn();
jest.mock('@aws-sdk/client-sqs', () => {
  const originalModule = jest.requireActual('@aws-sdk/client-sqs');

  return {
    ...originalModule,
    SQSClient: jest.fn().mockImplementation(() => {
      return {
        send,
      };
    }),
  };
});

@RegisterMessage('01H8X87B4WKJGTPBP8GNSQY59X')
class TestMessage extends Message {
  constructor(args: { payload: string }) {
    super(args);
    this.payload = args.payload;
  }

  readonly payload: string;
}

const listenerTell = jest.fn();

class Listener extends Actor {
  protected async handleMessage(message: Message) {
    listenerTell(message);
  }
}

describe('Given an SqsActor', () => {
  let sqsActor: ActorRef<SqsActor>;
  let listener: ActorRef;
  let mockSQS: { send: jest.Mock };
  const queueUrl = 'https://example.com/queue';

  beforeEach(() => {
    const SQSClient = require('@aws-sdk/client-sqs').SQSClient;
    mockSQS = new SQSClient();

    sqsActor = ActorSystem.create(SqsActor, { queueUrl });
    listener = ActorSystem.create(Listener);

    listenerTell.mockReset();

    sqsActor.tell(
      new Subscribe({
        listener,
      }),
    );
  });

  describe('When it receives a StartPolling message', () => {
    beforeEach(async () => {
      mockSQS.send.mockResolvedValueOnce({
        Messages: [],
      });

      sqsActor.tell(
        new StartPolling({
          receiveArgs: {},
        }),
      );
      await new Promise((resolve) => setTimeout(resolve, 0));

      sqsActor.tell(new StopPolling());
    });

    it('Then polling SQS is started', () => {
      expect(mockSQS.send).toBeCalledWith(
        expect.objectContaining({
          input: {
            AttributeNames: undefined,
            MaxNumberOfMessages: 10,
            MessageAttributeNames: undefined,
            QueueUrl: queueUrl,
            ReceiveRequestAttemptId: undefined,
            VisibilityTimeout: undefined,
            WaitTimeSeconds: 20,
          },
        }),
        expect.anything(),
      );
    });
  });

  describe('When it receives a ProcessingComplete message', () => {
    beforeEach(async () => {
      const message = new TestMessage({
        payload: 'test',
      });

      mockSQS.send.mockReset();

      mockSQS.send.mockResolvedValueOnce({
        Messages: [
          { ReceiptHandle: 'test-handle', Body: JSON.stringify(message) },
        ],
      });

      sqsActor.tell(
        new StartPolling({
          receiveArgs: {},
        }),
      );
      await new Promise((resolve) => setTimeout(resolve, 0));

      sqsActor.tell(
        new Subscribe({
          listener,
        }),
      );

      listenerTell.mockReset();

      sqsActor.tell(
        new ProcessingComplete({
          reason: message,
        }),
      );
    });

    afterEach(() => {
      sqsActor.tell(new StopPolling());
    });

    it('Then polling SQS Delete command is sent', () => {
      expect(mockSQS.send).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          input: {
            QueueUrl: queueUrl,
            ReceiptHandle: 'test-handle',
          },
        }),
      );
    });

    it('Then success message is emitted', () => {
      expect(listenerTell).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          code: SuccessMessage.code,
          reason: expect.objectContaining({
            code: ProcessingComplete.code,
            reason: expect.objectContaining({
              code: TestMessage.code,
            }),
          }),
        }),
      );
    });
  });
});
