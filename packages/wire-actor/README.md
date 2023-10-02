# WireActor

The `WireActor` class is an extension of the `Actor` class designed to manage the flow of messages between a writer and
multiple readers.

## Table of Contents

- [Importing the Class](#importing-the-class)
- [Constructor](#constructor)
- [Usage](#usage-example)

## Importing the Class

```typescript
import { WireActor } from '@anyit/wire-actor';
```

## Constructor

The constructor accepts an object of type `WireActorArgs`.

### WireActorArgs

This is a combination of the properties required for `Actor` along with:

- `writer: ActorRef`: The actor reference for the writer.
- `readers: ActorRef[]`: The list of actor references representing the readers.

Example:

```typescript
const wireActor = new WireActor({
  ...actorArgs,           // Arguments relevant to Actor
  writer: writerActorRef,
  readers: [reader1ActorRef, reader2ActorRef]
});
```

## Usage Example

```typescript
import {WireActor} from '@anyit/wire-actor';
import {Message, ReceiveMessage} from '@anyit/messaging';
import {ActorSystem, Subscribe} from "@anyit/actor";

@ReceiveMessage('01H9ZK5P6AY2KTBBPXNZ49S2R5')
class TestMessage extends Message {}

// Configuration for WireActor
const config = {
  // ... Actor arguments
  writer: writerActorRef,
  readers: [reader1ActorRef, reader2ActorRef]
};

const wireActor = ActorSystem.create(WireActor, config);
const listener = ActorSystem.create(Actor);

// Subscribe to get all messages that are coming from readers
wireActor.tell(new Subscribe({
  listener
}));

// Tell message to the writer actor
await wireActor.tell(new TestMessage());
```
