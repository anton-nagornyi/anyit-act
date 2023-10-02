import { Actor, ActorArgs } from '@anyit/actor';
import { KeyValueStore } from './store/key-value-store';
import { SetValue } from './messages/set-value';
import { GetValue } from './messages/get-value';
import { GetValueSuccess } from './messages/get-value-success';
import { GetMultipleValues } from './messages/get-multiple-values';
import { GetMultipleValuesSuccess } from './messages/get-multiple-values-success';
import { DeleteKey } from './messages/delete-key';
import { DeleteKeySuccess } from './messages/delete-key-success';
import { SetValueSuccess } from './messages/set-value-success';
import { InMemoryKeyValueStore } from './store/in-memory-key-value-store';
import { ErrorMessage } from '@anyit/messaging';
import { Receive } from '@anyit/message-handling';

export type KeyValueActorProps = ActorArgs & {
  store?: KeyValueStore;
};

export class KeyValueActor extends Actor {
  private readonly store: KeyValueStore;

  constructor(props: KeyValueActorProps) {
    super(props);

    this.store = props.store ?? new InMemoryKeyValueStore();
  }

  async setValue(@Receive message: SetValue) {
    const { key, traceId, value, options } = message;

    try {
      await this.store.set(key, value, options);
      return this.emitToListeners(
        new SetValueSuccess({
          key,
          value,
          options,
        }),
      );
    } catch (error: any) {
      return this.emitToListeners(
        new ErrorMessage({
          reason: message,
          traceId: traceId,
          error,
        }),
      );
    }
  }

  async getValue(@Receive message: GetValue) {
    const { key, traceId } = message;
    try {
      const value = await this.store.get(key);
      return this.emitToListeners(
        new GetValueSuccess({
          key,
          traceId: traceId,
          value,
        }),
      );
    } catch (error: any) {
      return this.emitToListeners(
        new ErrorMessage({
          reason: message,
          traceId: traceId,
          error,
        }),
      );
    }
  }

  async getMultipleValues(@Receive message: GetMultipleValues) {
    const { keys, traceId } = message;

    const keyValues = await Promise.all(
      keys.map(async (key) => {
        try {
          const value = await this.store.get(key);
          return [key, value] as const;
        } catch (error: any) {
          return [key, error] as const;
        }
      }),
    );

    return this.emitToListeners(
      new GetMultipleValuesSuccess({
        traceId: traceId,
        keyValues: Object.fromEntries(keyValues),
      }),
    );
  }

  async deleteKey(@Receive message: DeleteKey) {
    const { key, traceId } = message;

    try {
      await this.store.delete(key);
      return this.emitToListeners(
        new DeleteKeySuccess({
          traceId: traceId,
          key,
        }),
      );
    } catch (error: any) {
      return this.emitToListeners(
        new ErrorMessage({
          traceId: traceId,
          reason: message,
          error,
        }),
      );
    }
  }
}
