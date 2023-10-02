import { InMemoryKeyValueStore } from '../src/store/in-memory-key-value-store';
import { KeyIsMissingError } from '../src/errors/key-is-missing-error';
import { Pattern } from '../src/store/pattern';

describe('Given an InMemoryKeyValueStore', () => {
  let store: InMemoryKeyValueStore;

  beforeEach(() => {
    store = new InMemoryKeyValueStore();
  });

  describe('When setting a key-value pair', () => {
    beforeEach(async () => {
      await store.set('key', 'value');
    });

    it('Then the value should be retrievable', async () => {
      expect(await store.get('key')).toEqual('value');
    });

    describe('And setting the key with a ttl', () => {
      beforeEach(async () => {
        await store.set('temporaryKey', 'tempValue', { ttl: 50 });
      });

      it('Then the key should be deleted after the ttl', (done: Function) => {
        setTimeout(async () => {
          try {
            await store.get('temporaryKey');
          } catch (error) {
            expect(error).toBeInstanceOf(KeyIsMissingError);
            done();
          }
        }, 55); // Checking just after the ttl has expired.
      });
    });
  });

  describe('When getting a non-existent key', () => {
    it('Then it should throw a KeyIsMissingError', () => {
      expect(() => store.get('nonexistent')).toThrowError(KeyIsMissingError);
    });
  });

  describe('When deleting a key', () => {
    beforeEach(async () => {
      await store.set('deleteMe', 'value');
    });

    it('Then the key should be removed', async () => {
      await store.delete('deleteMe');
      expect(() => store.get('deleteMe')).toThrowError(KeyIsMissingError);
    });
  });

  describe('When deleting keys based on a pattern', () => {
    beforeEach(async () => {
      await store.set('pattern1', 'value1');
      await store.set('pattern2', 'value2');
      await store.set('mismatch', 'value3');
    });

    it('Then the matching keys should be removed', async () => {
      await store.delete('pattern*', Pattern.glob);
      expect(() => store.get('pattern1')).toThrowError(KeyIsMissingError);
      expect(() => store.get('pattern2')).toThrowError(KeyIsMissingError);
      await expect(store.get('mismatch')).resolves.toEqual('value3'); // This should still be there
    });
  });
});
