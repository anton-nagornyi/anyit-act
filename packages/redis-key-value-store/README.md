# Redis KeyValueStore

## Overview

The `RedisKeyValueStore` class provides an implementation of the `KeyValueStore` interface, utilizing Redis as the 
underlying storage mechanism. This class ensures a consistent key-value storage abstraction while taking advantage of 
Redis's speed and efficiency.

## Dependencies

The class relies on the following libraries:

- `@anyit/key-value-actor`: For the foundational key-value store types and patterns.
- `redis`: To interface with a Redis database.
- `@anyit/logger-interface`: To provide a consistent logging mechanism.

## Class Definition

### Constructor Parameters

When initializing a `RedisKeyValueStore` instance, the following arguments are required:

```typescript
type RedisKeyValueStoreArgs = {
  redis: Parameters<typeof createClient>[0];
  logger?: LoggerInterface;
};
```

The `redis` parameter takes the options for creating a new Redis client. Optionally, you can pass a custom logger that 
implements the `LoggerInterface`. If no logger is provided, a `SilentLogger` is used by default.

### Methods

#### delete(key: string, pattern?: Pattern)

Deletes a specific key or keys matching a pattern. If no pattern is provided, it will attempt to delete the specific key.

#### get(key: string)

Fetches the value associated with a key. Throws a `KeyIsMissingError` if the key is not present.

#### set(key: string, value: any, options?: KeyValueStoreOptions)

Sets a value for a specific key. Optional settings, such as TTL (time-to-live), can be specified in the `options`.

## Error Handling

All Redis operations are wrapped in try-catch blocks, ensuring any errors that occur are logged using the provided logger.

## Logging

The class is equipped with robust logging capabilities. It logs warnings when Redis isn't ready and errors that might 
occur during operations. The default logger suppresses all logging outputs (`SilentLogger`), but a custom logger can be 
provided to handle these logs differently.

## Usage

To utilize the `RedisKeyValueStore`, you should:

1. Create an instance with the appropriate Redis configuration.
2. Use the `get`, `set`, and `delete` methods for standard key-value store operations.

Note: Proper error handling should be implemented in the application using this store, especially since the `get` method
can throw an error if a key is missing.
