# Message Handling

This library facilitates easy handling of messages within your application. By providing decorators, it allows you to 
wire up message handlers. It uses Reflect Metadata to extract type information and ensures the correct 
handlers are invoked for different message types.

## Installation

First, ensure you have the necessary dependencies:
```bash
npm install reflect-metadata
```

And install the library itself:
```bash
npm install @anyit/message-handling
```

## Usage

### 1. MessageHandler Type

The `MessageHandler` type is the core structure that defines how a message should be handled. It contains:

- `class`: Details of the class and method that will handle the message.
- `message`: Details of the message type.
- `handleFunction`: A function that takes a message and returns a result (either void, `SuccessMessage`, or `ErrorMessage`).

### 2. Message Handling Decorators

Use the `Receive` decorator to annotate methods in a class that should handle specific message types. The decorator 
intercepts the method invocation, populates the necessary message arguments, and then invokes the original method.

Example:

```typescript
import {Receive} from "@anyit/message-handling";

class MyHandler {
  handleMessage(@Receive message: MyMessageType) {
    // Handle the message here
  }
}
```

In the following example, `handleMessage` will receive either `message1` or `message2`. Another argument will be 
undefined.
```typescript
import {Receive} from "@anyit/message-handling";

class MyHandler {
  handleMessage(@Receive message1: MyMessageType1, @Receive message2: MyMessageType2) {
    // Handle the message here
  }
}
```

#### `ReceiveFilter`

Used to specify which messages a handler should receive based on their type. By default, the message is passed as the 
**first** argument to the handler.

```typescript
import {ReceiveFilter} from "@anyit/message-handling";

class MyHandler {
  @ReceiveFilter(MyMessageType1, MyMessageType2)
  handleSomeMessage(
    message: MyMessageType1 | MyMessageType2
  ) {
   // Logic here
  }
}
```

For customized parameter order:

```typescript
import {ReceiveFilter} from "@anyit/message-handling";

class MyHandler {
  @ReceiveFilter({messageType: [MyMessageType1, MyMessageType2], parameterIndex: 2})
  handleSomeMessage(
    otherParam: SomeOtherType,
    yetAnotherParam: AnotherType,
    message: MyMessageType1 | MyMessageType2
  ) {
   // Logic here
  }
}
```

#### `ReasonFilter`

Use with `Receive` or `ReceiveFilter` to capture the reason for a message. By default, it's the **second** argument, 
but you can change this with `parameterIndex`.

```typescript
import {ReasonFilter, Receive} from "@anyit/message-handling";

class MyHandler {
  @ReasonFilter({messageType: [MyReasonType1, MyReasonType2], parameterIndex: 2})
  handleReason(
    @Receive message: ErrorMessage,
    otherParam: SomeOtherType,
    reason: MyReasonType1 | MyReasonType2
  ) {
    // Logic here
  }
}
```

#### `ErrorFilter`

Captures specific error types. By default, errors are the **third** argument. Adjust with `parameterIndex`.

```typescript
import {ErrorRaisedFilter, Receive} from "@anyit/message-handling";

class MyHandler {
  @ErrorRaisedFilter({errors: [TestError, TestError1], parameterIndex: 3})
  handleError(
    @Receive message: ErrorMessage,
    otherParam1: SomeType,
    otherParam2: AnotherType,
    error: TestError | TestError1
  ) {
    // Logic here
  }
}
```

#### `ReceiveSuccess`

Used to capture `SuccessMessage` and passes the reason message as the argument to the handler. If combined with the 
`Reason` or the `ReasonFilter` decorator, you'll get the reason of the reason.

```typescript
import {Reason, ReceiveSuccess} from "@anyit/message-handling";

class MyHandler {
  handleSuccess(@ReceiveSuccess message: SuccessReason, @Reason reason: MyReasonType) {
    // Logic here
  }
}
```

```typescript
import {ReasonFilter, ReceiveSuccess} from "@anyit/message-handling";

class MyHandler {
  @ReasonFilter(MyReasonType)
  handleSuccess(@ReceiveSuccess message: SuccessReason, reason: MyReasonType) {
    // Logic here
  }
}
```

```typescript
import {ReasonFilter, ReceiveSuccess} from "@anyit/message-handling";

class MyHandler {
  @ReasonFilter({messageType: [MyReasonType], parameterIndex: 2})
  handleSuccess(otherParam: SomeType, @ReceiveSuccess message: SuccessReason, reason: MyReasonType) {
    // Logic here
  }
}
```

#### `ReceiveError`

Captures `ErrorMessage` and will pass the reason message as the argument to the handler. Use with the `Reason` or the 
`ReasonFilter` decorator to get the reason of the reason.

```typescript
import {Reason, ReceiveError} from "@anyit/message-handling";

class MyHandler {
  handleError(@ReceiveError message: ErrorReason, @Reason reason: MyReasonType) {
    // Logic here
  }
}
```

```typescript
import {ReasonFilter, ReceiveError} from "@anyit/message-handling";

class MyHandler {
  @ReasonFilter(MyReasonType)
  handleError(@ReceiveError message: ErrorReason, reason: MyReasonType) {
    // Logic here
  }
}
```

```typescript
import {ReasonFilter, ReceiveError} from "@anyit/message-handling";

class MyHandler {
  @ReasonFilter({messageType: [MyReasonType], parameterIndex: 2})
  handleError(otherParam: SomeType, @ReceiveError message: ErrorReason, reason: MyReasonType) {
    // Logic here
  }
}
```

Use with the `ErrorRaised` or with the `ErrorRaisedFilter`

```typescript
import {ErrorRaised, Reason, ReceiveError} from "@anyit/message-handling";

class MyHandler {
  handleError(@ReceiveError message: ErrorReason, @Reason reason: MyReasonType, @ErrorRaised error: ErrorType) {
    // Logic here
  }
}
```

```typescript
import {ErrorRaised, ReasonFilter, ReceiveError} from "@anyit/message-handling";

class MyHandler {
  @ReasonFilter(MyReasonType)
  @ErrorRaisedFilter(ErrorType)
  handleError(@ReceiveError message: ErrorReason, reason: MyReasonType, error: ErrorType) {
    // Logic here
  }
}
```

```typescript
import {ErrorRaisedFilter, ReasonFilter, ReceiveError} from "@anyit/message-handling";

class MyHandler {
  @ReasonFilter({messageType: [MyReasonType], parameterIndex: 2})
  @ErrorRaisedFilter({errors: [ErrorType], parameterIndex: 3})
  handleError(otherParam: SomeType, @ReceiveError message: ErrorReason, reason: MyReasonType, error: ErrorType) {
    // Logic here
  }
}
```

### 3. MessageHandlers Class & Events

#### `setHandler(type: Constructor, handler: MessageHandler)`

Registers a new message handler.

#### `getHandlers(type: Constructor, code: string): MessageHandler[] | null`

Fetches the registered handlers by class type and message code.

#### `getHandlers(code: string): MessageHandler[] | null`

Fetches the registered handlers just by the message code.


### 4. Event Handling in MessageHandlers
In the process of handling messages, two significant events are emitted: beforeHandling and afterHandling. These events 
provide hooks that can be beneficial for various side effects like logging, monitoring, or any custom operation you 
might want to perform.

#### `beforeHandling` Event
This event is emitted right before a message handler is called. You can use this event to prepare the context or even 
inspect the message before it's handled.

To subscribe:
```typescript
MessageHandlers.events.on('beforeHandling', (message: Message, handler: { class: string; method: string }) => {
// Custom logic before handling
});
```

#### `afterHandling` Event
This event is emitted right after a message has been handled. Any errors thrown by handlers of the afterHandling event 
are watched and suppressed to ensure that the primary message handling flow is not interrupted.

To subscribe:
```typescript
MessageHandlers.events.on('afterHandling', (message: Message, handler: { class: string; method: string }) => {
// Custom logic after handling
});
```


## License

This library is licensed under the [MIT License](./LICENSE).

## Conclusion

`@anyit/message-handling` is a flexible and powerful tool for handling messages within your application. With easy 
annotations and dynamic handler registration, you can efficiently wire up your message processing logic. For any issues 
or further documentation, please refer to our official repository.
