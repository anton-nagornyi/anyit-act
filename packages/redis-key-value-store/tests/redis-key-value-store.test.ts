import { SilentLogger } from '@anyit/logger-interface';
import { KeyIsMissingError } from '@anyit/key-value-actor';
import { RedisKeyValueStore } from '../src/redis-key-value-store';

jest.mock('redis', () => {
  return {
    createClient: jest.fn(() => ({
      del: jest.fn(),
      get: jest.fn(),
      set: jest.fn(),
      scan: jest.fn(),
      isReady: true,
    })),
  };
});

describe('Given a RedisKeyValueStore class', () => {
  let store: RedisKeyValueStore;
  let mockLogger: SilentLogger;
  let mockRedis: {
    del: jest.Mock;
    get: jest.Mock;
    set: jest.Mock;
    scan: jest.Mock;
    isReady: boolean;
  };

  beforeEach(() => {
    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as any;
    store = new RedisKeyValueStore({ redis: {}, logger: mockLogger });
    mockRedis = (store as any).redis;
  });

  describe('When deleting a key', () => {
    it('Then it should delete the key if Redis is ready', async () => {
      await store.delete('testKey');
      expect(mockRedis.del).toBeCalledWith('testKey');
    });

    it('Then it should warn if Redis is not ready', async () => {
      mockRedis.isReady = false;
      await store.delete('testKey');
      expect(mockLogger.warn).toBeCalledWith(
        '[Redis]: is not ready',
        expect.anything(),
      );
    });

    it('Then it should log an error if an exception occurs', async () => {
      mockRedis.del.mockRejectedValue(new Error('Fake error'));
      await store.delete('testKey');
      expect(mockLogger.error).toBeCalledWith(new Error('Fake error'));
    });
  });

  describe('When setting a key', () => {
    it('Then it should set the key if Redis is ready', async () => {
      await store.set('testKey', 'value');
      expect(mockRedis.set).toBeCalledWith('testKey', 'value', {
        EX: 0,
      });
    });

    it('Then it should warn if Redis is not ready', async () => {
      mockRedis.isReady = false;
      await store.set('testKey', 'value');
      expect(mockLogger.warn).toBeCalledWith(
        '[Redis]: redis is not ready',
        expect.anything(),
      );
    });

    it('Then it should log an error if an exception occurs', async () => {
      mockRedis.set.mockRejectedValue(new Error('Fake error'));
      await store.set('testKey', 'value');
      expect(mockLogger.error).toBeCalledWith(new Error('Fake error'));
    });
  });

  describe('When getting a key', () => {
    it('Then it should return the value if key exists and Redis is ready', async () => {
      mockRedis.get.mockResolvedValue('value');
      const result = await store.get('testKey');
      expect(result).toBe('value');
    });

    it('Then it should throw an error if key does not exist', async () => {
      mockRedis.get.mockResolvedValue(null);
      await expect(store.get('testKey')).rejects.toThrow(KeyIsMissingError);
    });

    it('Then it should warn if Redis is not ready', async () => {
      mockRedis.isReady = false;
      await expect(store.get('testKey')).rejects.toThrow();
      expect(mockLogger.warn).toBeCalledWith(
        '[Redis]: redis is not ready',
        expect.anything(),
      );
    });

    it('Then it should log an error if an exception occurs', async () => {
      mockRedis.get.mockRejectedValue(new Error('Fake error'));
      await expect(store.get('testKey')).rejects.toThrow();
      expect(mockLogger.error).toBeCalledWith(new Error('Fake error'));
    });
  });
});
