# Log Utility Library

The `Log` utility wraps around the `LogActor` to provide a more straightforward interface for logging operations.
By abstracting actor-level complexities, it enables efficient and direct log calls.

## 1. Library Details

- **Path**: `@anyit/logger`
- **Dependent Classes**:
    - `LogActor`
- **Dependent Messages**:
    - `LogMessage`
    - `SetLogLevel`
- **Dependent Enums**:
    - `LogLevel`

## 2. Configuration

The `Log` utility provides an auto-initialized logging actor. It uses the static `LOGGER_ADDRESS` as its unique 
identifier within the actor system.

With `LOGGER_ADDRESS`, you have the flexibility to register any actor for logging purposes. This means you can
substitute the default `LogActor` with a custom actor that may have different logging behaviors, integrate with 
third-party logging solutions, or forward logs to external systems.

By ensuring that your custom actor responds to the same messages and behaviors as `LogActor`, you can seamlessly 
integrate it into the logging system without modifying the primary `Log` utility. Ensure that the custom actor is 
registered with the same `LOGGER_ADDRESS` to override the default logging behavior.

**Important**: If no custom actor is registered using the `LOGGER_ADDRESS`, the system will default to creating and 
using the `LogActor`. This ensures that logging operations continue to function even if a custom actor is not provided.

## 3. Setting and Getting the Log Level

The log level determines the minimum severity of log messages to be processed.

```typescript
// Setting the log level
Log.level = LogLevel.debug;

// Getting the current log level
const currentLogLevel = Log.level;
```

## 4. Logging Messages

Messages can be logged with various log levels. The methods accept a primary message and additional metadata arguments.

### 4.1. Debug

```typescript
Log.debug("This is a debug message", { key: "value" });
```

### 4.2. Error

```typescript
Log.error("This is an error message", { errorDetails: "Details here" });
```

### 4.3. Fatal

```typescript
Log.fatal("This is a fatal error message", { criticalInfo: "Data here" });
```

### 4.4. Info

```typescript
Log.info("This is an informational message");
```

### 4.5. Silly

```typescript
Log.silly("This is a silly message", "Additional data", 1234);
```

### 4.6. Warn

```typescript
Log.warn("This is a warning message", { potentialIssue: "Description" });
```

## 5. Behavior

- The `Log` utility dynamically fetches or creates the logging actor on demand.
- All messages are routed through the `LogActor` to ensure consistent logging behavior.

## 6. Exceptions

1. **Actor Resolution**: If the actor system cannot resolve or create the logging actor, logging operations might fail.
2. **Invalid Log Level**: Using log levels outside of the defined `LogLevel` enum might result in unexpected behaviors.

