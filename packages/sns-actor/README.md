# SnsActor Documentation

The `SnsActor` class is a specialized implementation of the `Actor` class that sends messages to an AWS Simple 
Notification Service (SNS) topic.

## Table of Contents

- [Importing the Class](#importing-the-class)
- [Properties](#properties)
- [Constructor](#constructor)

## Importing the Class

```typescript
import { SnsActor } from '@anyit/sns-actor';
```

## Properties

- `client: SNSClient`: An instance of the SNSClient used to interact with the AWS SNS service.
- `topic: string`: The Amazon Resource Name (ARN) of the SNS topic to which messages should be published.

## Constructor

The constructor takes a single argument, `props`, which is of type `SnsActorProps`.

### SnsActorProps

It is a combination of the arguments required for `Actor` and `SNSClient`, along with an additional `topic` property.

- Inherits properties from `ActorArgs`
- Inherits properties from `SNSClientArgs`
- `topic: string`: The ARN of the SNS topic to which messages should be published.

Example:

```typescript
const actor = new SnsActor({
  ...actorArgs,         // Arguments relevant to Actor
  ...snsClientArgs,     // Arguments relevant to SNSClient
  topic: 'your-topic-arn'
});
```

**Example Usage:**

```typescript
await actor.handleMessage(someMessage);
```

## Usage Example

To integrate `SnsActor` within your project:

```typescript
import {SnsActor} from '@anyit/sns-actor';
import {ActorSystem} from "@anyit/actor";
import {Message, RegisterMessage} from '@anyit/messaging';

@RegisterMessage('01H9XK2P7FG51J9M8CM3AW2EC2')
class TestMessage extends Message {

}

// Configuration for SnsActor
const config = {
  // ... Actor arguments
  // ... SNSClient arguments
  topic: 'arn:aws:sns:us-west-2:123456789012:MyTopic'
};

const actorRef = new ActorSystem.create(SnsActor, config);

// Use the actor to handle a message and publish it to the SNS topic.
const message = new TestMessage({ /* ... message content ... */});
await actorRef.tell(message);
```

Remember to  manage the required AWS permissions when using the `SnsActor` class in a real-world scenario.
