# sqs-actor

This documentation covers two powerful actors, `SqsActor` and `DuplicationCheckerActor`, which provide facilities for 
processing messages from AWS's SQS and for checking message duplication respectively.

## 1. `SqsActor`

This is the primary class of the library and encapsulates the logic for polling messages from an SQS queue, processing them, and handling errors.

#### Constructor

The `SqsActor` class requires an instance of `SqsActorArgs` to be provided during instantiation. This argument object includes configurations like:

- AWS SQS Client arguments
- The URL of the SQS queue to poll messages from
- Optional duplication checker actor reference
- Optional logger instance

#### Properties:

- `receipts`: Keeps track of received messages and their receipt handles.
- `logger`: Instance of the logger used.
- `client`: Instance of the SQS client.
- `queueUrl`: URL of the SQS queue.
- `handler`: Reference to the message handler actor.
- `duplication`: Reference to the duplication checker actor.
- `isPolling`: Indicates if the actor is currently polling messages.
- `abortController`: Used to abort the ongoing SQS polling request.
- `pollingTimeout`: Timeout reference for controlling the polling interval.

#### Key Methods:

- `start(ref: ActorRef)`: Initializes subscriptions and starts message processing.
- `processingComplete(@Receive message: ProcessingComplete)`: Handles the completion of message processing.
- `handleSqsMessageSuccess(@Receive message: HandleSqsMessageSuccess)`: Records the receipt handle of successfully processed messages.
- `handleError(@Receive message: ErrorMessage)`: Handles any errors that occur during processing.
- `startPolling(@Receive message: StartPolling)`: Begins polling messages from SQS.
- `stopPolling(@Receive _: StopPolling)`: Stops polling messages from SQS.
- `poll(abortController: AbortController, options?: ReceiveArgs)`: The main polling loop. Retrieves messages from SQS and forwards them for processing.
- `decideToPoll()`: Determines if polling should continue or stop.

### 2. Messages:

The library uses various messages for inter-actor communication and operations:

- `ReceiveArgs`: Arguments for the `ReceiveMessageCommand`.
- `StartPolling`: Message to start the polling process.
- `HandleSqsMessage`: Message containing an SQS message for processing.
- `HandleSqsMessageSuccess`: Notification of successful message processing.
- `StopPolling`: Message to stop the polling process.
- `ProcessingComplete`: Notification that processing of a message is complete.

### 3. Errors:

- `MessageIsAlreadyReceived`: Error indicating that a message has already been received.

## Usage

To use the `SqsActor` library:

1. Initialize the `SqsActor` with the necessary arguments.
2. Start the actor system.
3. Send a `StartPolling` message to the actor to begin polling messages from SQS.
4. Use the `StopPolling` message to stop the polling process when necessary.

## Conclusion

The `SqsActor` library offers a powerful and efficient way to integrate SQS with an actor-based system. It abstracts away many complexities, ensuring that your system remains responsive, resilient, and scalable.



## 2. `DuplicationCheckerActor`

The `DuplicationCheckerActor` provides functionality for checking if a message has already been received, based on a key-value system.

### Constructor

The `DuplicationCheckerActor` class requires an instance of `DuplicationCheckerActorArgs` to be provided during instantiation. This argument object includes:

- A reference to the key-value actor used to check duplication
- Optional prefix string which is prepended to the message ID to generate the unique key

### Properties:

- `keyValue`: Reference to the key-value actor used for checking duplication.
- `prefix`: A string prefix used in key generation.

### Key Methods:

- `start(ref: ActorRef)`: Initializes the actor and subscribes to relevant messages.
- `handleSqsMessageSuccess(@Receive message: HandleSqsMessageSuccess)`: Handles a successfully processed SQS message and checks for duplication.
- `getValueFail(@Receive message: ErrorMessage)`: Handles scenarios where a message value could not be fetched.
- `getValueSuccess(@Receive message: GetValueSuccess)`: Handles successful fetching of a message value and emits error if the message has already been received.

### Use Cases:

1. Initialize the `DuplicationCheckerActor` with necessary arguments.
2. Start the actor system.
3. As SQS messages are successfully processed by the `SqsActor`, they are sent to the `DuplicationCheckerActor` to ensure they haven't been processed before.

### Conclusion

The `DuplicationCheckerActor` ensures that your system processes each SQS message only once, adding an extra layer of reliability to your message processing pipeline.

