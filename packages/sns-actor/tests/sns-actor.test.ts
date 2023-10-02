import { ActorRef, ActorSystem } from '@anyit/actor';
import { Message, RegisterMessage } from '@anyit/messaging';
import { SnsActor } from '../src/sns-actor';

const mockSend = jest.fn();

jest.mock('@aws-sdk/client-sns', () => {
  const originalModule = jest.requireActual('@aws-sdk/client-sns');
  return {
    ...originalModule,
    SNSClient: jest.fn().mockImplementation(() => {
      return { send: mockSend };
    }),
  };
});

@RegisterMessage('01H9W63CRBKGKSEH7R4S4DQZPV')
class TestMessage extends Message {
  constructor(payload: string) {
    super();
    this.payload = payload;
  }

  readonly payload: string;
}
describe('Given a SnsActor', () => {
  const topic = 'test-topic';
  const snsClientArgs = {
    region: 'test-region',
  };

  let actor: ActorRef<SnsActor>;

  beforeEach(() => {
    actor = ActorSystem.create(SnsActor, {
      ...snsClientArgs,
      topic,
    });
    jest.clearAllMocks();
  });

  describe('When a message is received', () => {
    const testMessage = new TestMessage('test-payload');

    beforeEach(() => {
      actor.tell(testMessage);
    });

    it('Then it should send the message to the SNS topic', () => {
      expect(mockSend).toBeCalledWith(
        expect.objectContaining({
          input: {
            TopicArn: topic,
            Message: JSON.stringify(testMessage),
          },
        }),
      );
    });
  });
});
