# Logger Interface

## Overview

The library provides a logging abstraction with the `LoggerInterface`. This allows consistent logging patterns regardless 
of the underlying logging mechanism.

## LogLevel Definition

The `LogLevel` type enumerates the potential logging levels:

```typescript
export type LogLevel =
  | 'silent'
  | 'silly'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'fatal';
```

## LoggerInterface

The primary logging interface consists of the following methods:

```typescript
interface LoggerInterface {
  level: LogLevel;
  debug(message: any, ...meta: any[]): void;
  error(message: any, ...meta: any[]): void;
  fatal(message: any, ...meta: any[]): void;
  info(message: any, ...meta: any[]): void;
  silly(message: any, ...meta: any[]): void;
  warn(message: any, ...meta: any[]): void;
}
```

When implementing the `LoggerInterface`, ensure to define each method to process logging data accordingly.

## Static Logger Implementation

For classes that need to implement the `LoggerInterface` statically, use the `StaticLoggerInterface`:

```typescript
@StaticLoggerInterface
class YourStaticLoggerClass implements LoggerInterface {
  // your implementation here
}
```

This ensures that your class adheres to the `LoggerInterface` at compile time.

## SilentLogger Class

For situations where you don't want any logs to be outputted, use the `SilentLogger` class:

```typescript
class SilentLogger implements LoggerInterface {
  readonly level: LogLevel = 'silent';

  debug(): void {}

  error(): void {}

  fatal(): void {}

  info(): void {}

  silly(): void {}

  warn(): void {}
}
```

The `SilentLogger` is an implementation of the `LoggerInterface` that suppresses all logging outputs.

## Usage

To utilize the logger, instantiate or use a class that implements the `LoggerInterface`. Call the relevant methods 
(`debug`, `info`, etc.) to log messages with varying levels and metadata.

Note: Actual logging behavior will depend on the implementation of the `LoggerInterface`.
