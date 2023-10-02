import { KeyValueStoreOptions } from './key-value-store-options';
import { Pattern } from './pattern';

export abstract class KeyValueStore {
  abstract set(
    key: string,
    value: any,
    options?: KeyValueStoreOptions,
  ): Promise<void>;
  abstract get(key: string): Promise<string>;
  abstract delete(key: string, pattern?: Pattern): Promise<void>;
}
