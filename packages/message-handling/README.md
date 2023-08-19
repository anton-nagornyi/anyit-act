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

### 2. `Receive` Decorator

Use the `Receive` decorator to annotate methods in a class that should handle specific message types. The decorator intercepts the method invocation, populates the necessary message arguments, and then invokes the original method.

Example:

```typescript
class MyHandler {
  handleMessage(@Receive message: MyMessageType) {
    // Handle the message here
  }
}
```

### 3. MessageHandlers Class

This class is a utility to manage the registered message handlers. It provides:

- `setHandler`: Registers a new message handler.
- `getHandlers`: Fetches registered handlers either by class type and message code, or just by message code.

### Sample Registration & Invocation

To use the system:

1. Decorate the method intended for handling messages:

```typescript
class SampleHandler {
  handleSomeMessage(@Receive message: SomeMessageType) {
    // Logic here
  }
}
```

2. When a message arrives:

```typescript
const handlers = MessageHandlers.getHandlers(SomeMessageType.code);
if (handlers) {
  for (const handler of handlers) {
    handler.handleFunction(message);
  }
}
```

## API Reference

### `MessageHandlers`

#### `setHandler(type: Constructor, handler: MessageHandler)`

- `type`: Constructor of the class that will handle the message.
- `handler`: The message handler details.

Registers a new message handler.

#### `getHandlers(type: Constructor, code: string): MessageHandler[] | null`

Fetches the registered handlers by class type and message code.

#### `getHandlers(code: string): MessageHandler[] | null`

Fetches the registered handlers just by the message code.

## License

This library is licensed under the [MIT License](./LICENSE).

## Conclusion

`@anyit/message-handling` is a flexible and powerful tool for handling messages within your application. With easy 
annotations and dynamic handler registration, you can efficiently wire up your message processing logic. For any issues 
or further documentation, please refer to our official repository.
