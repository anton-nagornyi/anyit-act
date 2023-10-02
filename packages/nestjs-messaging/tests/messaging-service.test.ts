import { Test, TestingModule } from '@nestjs/testing';
import { Message } from '@anyit/messaging';
import { Subscribe } from '@anyit/actor';
import { MessagingService } from '../src/messaging-service';
import { KEY_VALUE_ACTOR, WIRE_ACTOR } from '../src/constants';

class TestMessage extends Message {
  constructor(readonly payload: string) {
    super();
  }
}

describe('Given a MessagingService', () => {
  let service: MessagingService;
  let mockWireActor: any;
  let mockKeyValueActor: any;

  beforeEach(async () => {
    mockWireActor = {
      tell: jest.fn(),
    };
    mockKeyValueActor = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagingService,
        {
          provide: WIRE_ACTOR,
          useValue: mockWireActor,
        },
        {
          provide: KEY_VALUE_ACTOR,
          useValue: mockKeyValueActor,
        },
      ],
    }).compile();

    service = module.get<MessagingService>(MessagingService);
  });

  describe('When the service is initialized', () => {
    it('Then the wire actor should be subscribed with a MessageHandlingActor listener', () => {
      expect(mockWireActor.tell).toHaveBeenCalledWith(expect.any(Subscribe));
    });
  });

  describe('When sending a message using tell', () => {
    const mockMessage = new TestMessage('test-payload');

    beforeEach(() => {
      service.tell(mockMessage);
    });

    it('Then the message should be forwarded to the wire actor', () => {
      expect(mockWireActor.tell).toHaveBeenCalledWith(mockMessage);
    });
  });
});
