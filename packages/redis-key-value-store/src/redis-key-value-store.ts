import {
  KeyIsMissingError,
  KeyValueStore,
  KeyValueStoreOptions,
  Pattern,
} from '@anyit/key-value-actor';
import { createClient } from 'redis';
import { LoggerInterface, SilentLogger } from '@anyit/logger-interface';

export type RedisKeyValueStoreArgs = {
  redis: Parameters<typeof createClient>[0];
  logger?: LoggerInterface;
};

export class RedisKeyValueStore extends KeyValueStore {
  constructor(args: RedisKeyValueStoreArgs) {
    super();

    this.redis = createClient(args.redis);
    this.logger = args.logger ?? new SilentLogger();
  }

  private readonly logger: LoggerInterface;

  private readonly redis: ReturnType<typeof createClient>;

  async delete(key: string, pattern?: Pattern) {
    try {
      if (this.redis?.isReady) {
        if (!pattern) {
          await this.redis!.del(key);
        } else {
          const keysToRemove = await this.scanKeys(pattern);
          this.logger.info(`[Redis]: redis removing ${keysToRemove.length}`);
          await Promise.all(
            keysToRemove.map((keyToRemove) => this.redis!.del(keyToRemove)),
          );
        }
      } else {
        this.logger.warn('[Redis]: is not ready', {
          redis: this.redis,
          isReady: this.redis?.isReady,
        });
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  async get(key: string) {
    try {
      if (this.redis?.isReady) {
        const result = await this.redis.get(key);
        if (result !== null && result !== undefined) {
          return result;
        }
      } else {
        this.logger.warn('[Redis]: redis is not ready', {
          redis: this.redis,
          isReady: this.redis?.isReady,
        });
      }
    } catch (e) {
      this.logger.error(e);
    }

    throw new KeyIsMissingError(key);
  }

  async set(
    key: string,
    value: any,
    options?: KeyValueStoreOptions,
  ): Promise<void> {
    const ttl = options?.ttl ?? 0;

    try {
      if (this.redis?.isReady) {
        await this.redis.set(key, value, { EX: ttl });
      } else {
        this.logger.warn('[Redis]: redis is not ready', {
          redis: this.redis,
          isReady: this.redis?.isReady,
        });
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async scanKeys(pattern: string) {
    let cursor = 0;
    let keys = [];
    const MAX_ITERATIONS = 100;
    let i = 0;

    try {
      if (this.redis?.isReady) {
        while (true) {
          const res = await this.redis.scan(cursor, {
            MATCH: pattern,
            COUNT: 1000,
          });
          cursor = res.cursor;
          keys.push(...res.keys);

          if (cursor === 0 || ++i === MAX_ITERATIONS) {
            break;
          }
        }
      }
    } catch (e) {
      this.logger.error(e);
    }
    return keys;
  }
}
