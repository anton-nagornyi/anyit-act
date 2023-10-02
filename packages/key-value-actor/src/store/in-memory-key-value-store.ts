import { KeyValueStore } from './key-value-store';
import { KeyIsMissingError } from '../errors/key-is-missing-error';
import { KeyValueStoreOptions } from './key-value-store-options';
import { Pattern } from './pattern';
import picomatch from 'picomatch';

export class InMemoryKeyValueStore extends KeyValueStore {
  private store = new Map<string, string>();

  delete(key: string, pattern?: Pattern): Promise<void> {
    if (pattern === Pattern.glob) {
      const isMatch = picomatch(key);

      for (const storeKey of this.store.keys()) {
        if (isMatch(storeKey)) {
          this.store.delete(storeKey);
        }
      }
    } else {
      this.store.delete(key);
    }

    return Promise.resolve();
  }

  get(key: string): Promise<string> {
    const value = this.store.get(key);

    if (value === undefined) {
      throw new KeyIsMissingError(key);
    }
    return Promise.resolve(value);
  }

  set(key: string, value: any, options?: KeyValueStoreOptions): Promise<void> {
    const ttl = options?.ttl ?? 0;

    this.store.set(key, value);

    if (ttl) {
      setTimeout(() => this.store.delete(key), ttl);
    }

    return Promise.resolve();
  }
}
