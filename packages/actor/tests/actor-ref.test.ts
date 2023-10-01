import { MessageTransmitter } from '../src/environment/message-transmitter';
import { ActorRef } from '../src/actor-ref';

describe('ActorRef', () => {
  let transmitter: MessageTransmitter;
  let actorRef: ActorRef;

  beforeEach(() => {
    transmitter = {
      send: jest.fn(),
    } as unknown as MessageTransmitter;
    actorRef = new ActorRef('some-address', transmitter);
  });

  describe('tell', () => {
    it('Then it should send a message using the transmitter', () => {
      const mockMessage = { type: 'some-type' };

      actorRef.tell(mockMessage as any);

      expect(transmitter.send).toHaveBeenCalledWith(
        'some-address',
        mockMessage,
      );
    });
  });
});
