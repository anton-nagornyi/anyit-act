import { LocalTransmitter } from '../src/environment/local-transmitter';
import { MissingActorError } from '../src/errors/missing-actor-error';

describe('LocalTransmitter', () => {
  let localTransmitter: LocalTransmitter;
  let mockResolver: any;
  let mockActor: any;

  beforeEach(() => {
    mockActor = {
      tell: jest.fn(),
      ask: jest.fn(),
    };
    mockResolver = {
      resolve: jest.fn().mockReturnValue(mockActor),
    };
    localTransmitter = new LocalTransmitter(mockResolver);
  });

  describe('send', () => {
    it('Then it should resolve the actor using the resolver and send the message using tell', () => {
      const mockAddress = 'mockAddress';
      const mockMessage = 'mockMessage';

      localTransmitter.send(mockAddress, mockMessage);

      expect(mockResolver.resolve).toBeCalledWith(mockAddress);
      expect(mockActor.tell).toBeCalledWith(mockMessage);
    });

    it('Then it should not call tell if the actor is not resolved', () => {
      mockResolver.resolve.mockReturnValue(null);

      const mockAddress = 'anotherMockAddress';
      const mockMessage = 'anotherMockMessage';

      localTransmitter.send(mockAddress, mockMessage);

      expect(mockResolver.resolve).toBeCalledWith(mockAddress);
      expect(mockActor.tell).not.toBeCalled();
    });
  });

  describe('request', () => {
    it('Then it should resolve the actor using the resolver and send the message using ask', () => {
      const mockAddress = 'mockAddress';
      const mockMessage = 'mockMessage';

      localTransmitter.request(mockAddress, mockMessage);

      expect(mockResolver.resolve).toBeCalledWith(mockAddress);
      expect(mockActor.ask).toBeCalledWith(mockMessage);
    });

    it('Then it should throw if the actor is not resolved', () => {
      mockResolver.resolve.mockReturnValue(null);

      const mockAddress = 'anotherMockAddress';
      const mockMessage = 'anotherMockMessage';

      expect(() => localTransmitter.request(mockAddress, mockMessage)).toThrow(
        MissingActorError,
      );

      expect(mockResolver.resolve).toBeCalledWith(mockAddress);
      expect(mockActor.tell).not.toBeCalled();
    });
  });
});
