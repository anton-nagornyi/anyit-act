# LogActor Library

The `LogActor` is a part of the actor library and is designed to handle logging operations with varying log levels. 
This actor provides fine-grained control over log verbosity, enabling efficient debugging and issue tracing.

## 1. Actor Details

- **Path**: `@anyit/log-actor`
- **Dependent Messages**:
    - `LogMessage`
    - `SetLogLevel`
- **Dependent Enums**:
    - `LogLevel`

## 2. Initialization

Actors should always be initiated using `ActorSystem.create()`. The constructor requires an argument of 
type `LogActorArgs`. This method returns an `ActorRef<LogActor>` which should be used to communicate with the actor.

```typescript
import { ActorSystem } from '@anyit/actor';
import { LogActor, LogLevel } from '@anyit/log-actor';

const logActorRef = ActorSystem.create(LogActor, { logLevel: LogLevel.info });
```

## 3. Messaging the Actor

Always use the `tell` method of the `ActorRef<LogActor>` to communicate with the actor.

### 3.1. Setting the Log Level

```typescript
import { SetLogLevel } from '@anyit/log-actor';

logActorRef.tell(new SetLogLevel({logLevel: 'debug'}));
```

### 3.2. Logging a Message

#### Message Structure: LogMessage

- **message** (optional): Contains the main log content.
- **meta** (optional): Contains any metadata associated with the log. It will be undefined if no metadata is provided.
- **level**: Specifies the log level. Note: 'silent' is excluded from this property.

```typescript
import { LogMessage } from '@anyit/log-actor';

logActorRef.tell(new LogMessage({ level: 'info', message: "This is an info message", meta: ["Metadata1", "Metadata2"] }));
```

## 4. Behavior

- If the `logLevel` is set to `silent`, the actor doesn't log any messages.
- Messages with a `LogLevel` less than the current `logLevel` will be ignored.
- Log messages can be tagged with meta information.
- Log output is directed to the console, with levels `silly`, `info`, and `debug` mapped to `console.log`, `warn` to `console.warn`, and `error` & `fatal` to `console.error`.

## 5. Exceptions

1. **Log Level Not Supported**: If a log level is passed that's not defined in `LogLevel`, the actor might throw errors or behave unexpectedly.
2. **Invalid Initialization**: Always ensure proper actor initialization using `ActorSystem.create()`.
