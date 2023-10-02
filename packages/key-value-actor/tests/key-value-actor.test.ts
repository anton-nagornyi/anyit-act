import { Actor, ActorRef, ActorSystem, Subscribe } from '@anyit/actor';

import { SetValue } from '../src/messages/set-value';
import { GetValue } from '../src/messages/get-value';
import { GetMultipleValues } from '../src/messages/get-multiple-values';
import { DeleteKey } from '../src/messages/delete-key';
import { InMemoryKeyValueStore } from '../src/store/in-memory-key-value-store';
import { KeyValueActor, KeyValueActorProps } from '../src/key-value-actor';
import { Message } from '@anyit/messaging';
import { SetValueSuccess } from '../src/messages/set-value-success';
import { GetValueSuccess } from '../src/messages/get-value-success';
import { GetMultipleValuesSuccess } from '../src/messages/get-multiple-values-success';
import { DeleteKeySuccess } from '../src/messages/delete-key-success';
import { KeyIsMissingError } from '../src/errors/key-is-missing-error';

class Listener extends Actor {
  constructor({
    address,
    emitToListeners,
  }: {
    address: string;
    emitToListeners: jest.Mock;
  }) {
    super({
      address,
    });

    this.emitToListenersMock = emitToListeners;
  }

  private readonly emitToListenersMock: jest.Mock;

  protected emitToListeners(message: Message) {
    super.emitToListeners(message);
    this.emitToListenersMock(message);
  }
}

describe('Given a KeyValueActor', () => {
  let keyValueActor: ActorRef<KeyValueActor>;
  let store: InMemoryKeyValueStore;

  beforeEach(() => {
    store = new InMemoryKeyValueStore();

    const args: KeyValueActorProps = {
      address: 'some-address',
      store,
    };

    keyValueActor = ActorSystem.create(KeyValueActor, args);
  });

  describe('When sending a SetValue message', () => {
    let mockMessage: SetValue;
    let listener: ActorRef<Listener>;
    let emitToListeners: jest.Mock;

    beforeEach(() => {
      mockMessage = new SetValue({
        key: 'test-key',
        value: 'test-value',
      });

      emitToListeners = jest.fn();
      listener = ActorSystem.create(Listener, {
        address: '01HA1CSG9VMX219PRJRXS3690H',
        emitToListeners,
      });
      keyValueActor.tell(
        new Subscribe({
          listener,
          messageTypes: [SetValueSuccess],
        }),
      );
      keyValueActor.tell(mockMessage);
    });

    it('Then it should store the value and emit SetValueSuccess', async () => {
      await expect(store.get(mockMessage.key)).resolves.toEqual(
        mockMessage.value,
      );
    });

    it('Then it should emit SetValueSuccess', () => {
      expect(emitToListeners).toBeCalledWith(
        expect.objectContaining({
          code: SetValueSuccess.code,
          key: mockMessage.key,
          value: mockMessage.value,
        }),
      );
    });
  });

  describe('When sending a GetValue message for an existing key', () => {
    let mockMessage: GetValue;
    let listener: ActorRef<Listener>;
    let emitToListeners: jest.Mock;

    beforeEach(async () => {
      await store.set('test-key-1', 'test-value-1');

      emitToListeners = jest.fn();
      listener = ActorSystem.create(Listener, {
        address: '01HA1CSG9VMX219PRJRXS3690H',
        emitToListeners,
      });
      keyValueActor.tell(
        new Subscribe({
          listener,
          messageTypes: [GetValueSuccess],
        }),
      );

      mockMessage = new GetValue({
        key: 'test-key-1',
      });
      keyValueActor.tell(mockMessage);
    });

    it('Then it should retrieve the value and emit GetValueSuccess', () => {
      expect(emitToListeners).toBeCalledWith(
        expect.objectContaining({
          code: GetValueSuccess.code,
          key: mockMessage.key,
          value: 'test-value-1',
        }),
      );
    });
  });

  describe('When sending a GetMultipleValues message', () => {
    let mockMessage: GetMultipleValues;
    let listener: ActorRef<Listener>;
    let emitToListeners: jest.Mock;

    beforeEach(async () => {
      await store.set('test-key-1', 'test-value-1');
      await store.set('test-key-2', 'test-value-2');

      mockMessage = new GetMultipleValues({
        keys: ['test-key-1', 'test-key-2'],
      });

      emitToListeners = jest.fn();
      listener = ActorSystem.create(Listener, {
        address: '01HA1K71XMRWCN5GAA5FBVMQYW',
        emitToListeners,
      });
      keyValueActor.tell(
        new Subscribe({
          listener,
          messageTypes: [GetMultipleValuesSuccess],
        }),
      );

      keyValueActor.tell(mockMessage);
    });

    it('Then it should emit GetMultipleValuesSuccess', () => {
      expect(emitToListeners).toBeCalledWith(
        expect.objectContaining({
          code: GetMultipleValuesSuccess.code,
          keyValues: {
            'test-key-1': 'test-value-1',
            'test-key-2': 'test-value-2',
          },
        }),
      );
    });
  });

  describe('When sending a DeleteKey message', () => {
    let mockMessage: DeleteKey;
    let listener: ActorRef<Listener>;
    let emitToListeners: jest.Mock;

    beforeEach(async () => {
      await store.set('test-key-3', 'test-value-3');
      mockMessage = new DeleteKey({
        key: 'test-key-3',
      });

      emitToListeners = jest.fn();
      listener = ActorSystem.create(Listener, {
        address: '01HA1QNDY865X8SP5FCEMN0C06',
        emitToListeners,
      });
      keyValueActor.tell(
        new Subscribe({
          listener,
          messageTypes: [DeleteKeySuccess],
        }),
      );

      keyValueActor.tell(mockMessage);
    });

    it('Then it should delete the key', () => {
      expect(() => store.get(mockMessage.key)).toThrowError(KeyIsMissingError);
    });

    it('Then it should emit DeleteKeySuccess', () => {
      expect(emitToListeners).toBeCalledWith(
        expect.objectContaining({
          code: DeleteKeySuccess.code,
          key: 'test-key-3',
        }),
      );
    });
  });
});
