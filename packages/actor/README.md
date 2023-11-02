# Actor-Based System Library

This library provides an implementation of the actor model for handling concurrency. It includes components 
like `Actor`, `ActorResolver`, `Environment`, and more.

## Table of Contents

- [Key Components](#key-components)
- [Installation](#installation)
- [Usage](#usage)

## Key Components

### Actor

The foundational piece in the library, representing an individual unit of computation.

- **Properties**: `address`, `inbox`, `listeners`, `everythingListeners`
- **Methods**: `handleMessage`, `subscribe`, `tell`, `process`, `emitToListeners`

### ActorResolver

A component responsible for managing and resolving actor addresses.

- **Methods**: `getNewAddress`, `register`, `resolve`

### Environment

Represents the context in which actors operate. It associates an actor resolver and a message transmitter.

### MessageTransmitter

Abstract class responsible for sending messages to actors.

- **Methods**: `send`

### ActorRef

Reference to an actor which allows sending messages.

- **Methods**: `tell`, `ask`

### ActorSystem

The main system for creating, managing, and communicating with actors.

- **Methods**: `resolve`, `getRef`, `create`

## Installation

### Via npm:

```bash
npm install @anyit/actor --save
```

### Via yarn:

```bash
yarn add @anyit/actor
```

### Peer Dependencies:

Ensure you have the necessary peer dependencies installed:

```bash
npm install reflect-metadata @anyit/messaging @anyit/messaging-handling --save
```

or with yarn:

```bash
yarn add reflect-metadata @anyit/messaging @anyit/messaging-handling
```

## Usage

1. **Creating an Actor**:
```typescript
   const actorRef = ActorSystem.create(MyActorClass, { customArg: 'value' });
```
2. **Subscribing to Messages:**:
```typescript
actor.subscribe(new Subscribe({ listener: anotherActorRef, messageTypes: [SomeMessage] }));;
```
3. **Send a message to an actor**:
```typescript
actorRef.tell(new MyMessage('Hello, World!'));
```

3. **Asking a message from an actor**:
```typescript
const {response, reason, error} = actorRef.ask(new MyMessage('Hello, World!'));
// response is SuccessMessage or ErrorMessage
// reason is MyMessage
// error is Error if actor responded with ErrorMessage
```

4. **Resolve an actor by address**:
```typescript
const resolvedActorRef = ActorSystem.resolve('some-actor-address');
```
