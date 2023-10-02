# Winston Actor logger

## Overview

`LogWinstonActor` integrates the `winston` logging library into an actor-based system, offering enhanced logging capabilities.

## Creating the Actor

Use the `ActorSystem.create` method to instantiate the `LogWinstonActor`:

```typescript
const actor = ActorSystem.create(LogWinstonActor, { winston: /* LoggerOptions */ });
```

Interactions with the actor should be done using messages, not direct method calls.

## Messaging the Actor

### Set Log Level:

```typescript
actor.tell(new SetLogLevel({ logLevel: 'info' }));
```

### Log a Message:

```typescript
actor.tell(new LogMessage({
  message: "Sample log message.",
  level: 'info'
}));
```

## Internals of LogWinstonActor

The actor internally uses a Winston logger, which can be customized with `winston.LoggerOptions`. When messages are sent
to the actor, they are processed and passed to the Winston logger.

## WinstonLogger Utility

A utility function to create a pre-configured Winston logger:

```typescript
const logger = WinstonLogger(/* LoggerOptions */);
```

Defaults:
- Level: 'info'
- Formats: Combined simple and error
- Transport: Console

## Formatting - Error and Simple

Two primary formats:

- **Error Format:** Transforms error information, capturing properties like error name, message, and stack trace.

- **Simple Format:** Basic log output. Safely stringifies and merges multiple metadata objects.

## Custom Logging with LOGGER_ADDRESS

To use `LogWinstonActor` with other systems or if you want to employ a different logging actor, register your custom 
actor using [Log](../logger/README.md#2-configuration).`LOGGER_ADDRESS`.
