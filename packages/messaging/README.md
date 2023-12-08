# Core Messaging Library

This library provides basic classes and decorators designed for streamlined messaging functionality. It's built with 
simplicity in mind, making it easy for developers to integrate and utilize within their projects to handle message-based 
interactions. Whether you're looking to process, route, or manage messages, this tool offers the essential building 
blocks to get started.

## Table of Contents

- [Message Base Class](#message-base-class)
- [Additional message types](#additional-message-types)
- [Decorators](#decorators)
- [Messages Factory](#messages-factory)
- [Error Class](#error-class)
- [Types and Helpers](#types-and-helpers)
- [Example Message Type](#example-message-type)
- [Conclusion](#conclusion)

## Message Base Class

### `Message`

The `Message` class is an abstract class designed to act as the base for all custom message types.

**Public Properties**:
- `messageId`: A unique identifier for the message.
- `traceId`: An optional trace identifier. Its value will be taken from the `reason` if not directly provided.
- `createdAt`: Timestamp of message creation.
- `reason`: An optional reason message.
- `reasonId`: An optional reason message ID if for some reason providing of the whole message within the `reason` field
is unwanted.
- `sender`: An optional sender field to identify who is sending this message
- `type`: Returns the constructor's name.
- `code`: Returns the code associated with the message.

**Public Methods**:
- `toJSON()`: Returns a JSON representation of the message.
- `toString()`: Returns a string representation of the message.

## Additional Message Types

### `ErrorMessage`

A custom message type for error-related messages. It extends the base `Message` class and includes:

**Public Property**:
- `error`: Stores the error information.

When using this message, it is advisable to provide a `reason` to detail the context or specifics of the error.
#### Type Guard:

Use the `isErrorMessage` function to check if a given message instance is of the `ErrorMessage` type.

```typescript
if (isErrorMessage(someMessage)) {
    console.log("This is a error message.");
}
```

### `SuccessMessage`

This message type indicates a successful operation and extends the base `Message` class. When using this message, it is 
advisable to provide a `reason` to detail the context or specifics of the success.

#### Type Guard:

Use the `isSuccessMessage` function to check if a given message instance is of the `SuccessMessage` type.

```typescript
if (isSuccessMessage(someMessage)) {
    console.log("This is a success message.");
}
```

### `ProcessingComplete`

This message type signifies the completion of a processing task and also extends the base `Message` class. Similarly, 
it's recommended to accompany this message with a `reason` to provide clarity on what processing was completed.

#### Type Guard:

Use the `isProcessingComplete` function to verify if a given message instance is of the `ProcessingComplete` type.

```typescript
if (isProcessingComplete(someMessage)) {
    console.log("Processing is complete.");
}
```

## Decorators

### `RegisterMessage(uniqueCode: string)`

A decorator that registers a message type with a unique code.

**Parameters**:
- `uniqueCode`: A string that acts as a unique identifier for the message type.

## Messages Factory

### `MessageFactory`

This class provides methods for message instantiation and registration.

**Public Methods**:
- `create(input: { [key: string]: any })`: Creates a message instance from given input.

## Error Class

### `MessageDeserializeError`

This error is thrown when the `MessageFactory` is unable to deserialize a message due to unknown types.

## Types and Helpers

### `MessageArgs<T extends Message = Message>`

A utility type for constructing a message.

### `MessageType<T extends Message = Message>`

A type representing the message constructor with a code property.

## Example Message Type

In this section, we'll introduce an example message type based on a real-world use-case, showcasing how you can derive 
from the `Message` base class.

### `TerminateAccount`

A custom message type for deleting a specific account. It extends the base `Message` class.

```typescript
import { Message, MessageArgs, RegisterMessage } from '@anyit/messaging';

type TerminateAccountArgs = MessageArgs<TerminateAccount>;

@RegisterMessage('01H7XYZT08AS2ABCDEQQNMHRQ2')
export class TerminateAccount extends Message {
  constructor(args: TerminateAccountArgs) {
    super(args);

    this.accountID = args.accountID;
  }

  readonly accountID: string;
}

export const isTerminateAccount = (message?: Message): message is TerminateAccount =>
  Boolean(message && message.code === TerminateAccount.code);
```

# Conclusion

Utilize the `Message` class as a foundation for custom message types and leverage the `MessageFactory` for creation and 
deserialization of these custom types. Always use the `RegisterMessage` decorator to ensure custom messages are 
recognized by the system.