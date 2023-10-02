# anyit-act

This is the comprehensive collection of our core libraries for actor-based systems. This document provides an overview
of each package and its purpose, aiming to assist users and contributors alike.

## Table of Contents

- [Actor-Based System Library](#actor-based-system-library)
- [Key-Value Actor Library](#key-value-actor-library)
- [LogActor Library](#logactor-library)
- [Winston Actor logger](#winston-actor-logger)
- [Logger Interface](#logger-interface)
- [Log Utility Library](#log-utility-library)
- [Message Handling](#message-handling)
- [Core Messaging Library](#core-messaging-library)
- [Redis KeyValueStore](#redis-keyvaluestore)
- [SnsActor](#snsactor)
- [SqsActor](#sqsactor)
- [WireActor](#wireactor)
- [Nestjs messages service](#nestjs-messages-service)

---

## Actor-Based System Library

This library provides a foundational implementation of the actor model to manage concurrency. Components include:

- `Actor`
- `ActorResolver`
- `Environment`

[More details](./packages/actor/README.md)

---

## Key-Value Actor Library

Dedicated to offering a message-driven approach to manage key-value pairs. Key components include:

- `KeyValueActor`
- `InMemoryKeyValueStore`
- Defined communication messages
- Error handling

Ideal for caching solutions, configuration managers, or simple in-memory databases.

[More details](./packages/key-value-actor/README.md)

---

## LogActor Library

An essential part of the actor library geared towards handling various logging operations, `LogActor` ensures precise control over log verbosity.

[More details](./packages/log-actor/README.md)

---

## Winston Actor logger

`LogWinstonActor` merges the `winston` logging library with an actor-driven system, promoting superior logging capabilities.

[More details](./packages/log-winston-actor/README.md)

---

## Logger Interface

Promotes a standardized logging approach via the `LoggerInterface`, ensuring uniform logging patterns regardless of the underlying mechanism.

[More details](./packages/logger-interface/README.md)

---

## Log Utility Library

The `Log` utility is a user-friendly wrapper around `LogActor`, focusing on streamlining logging tasks by hiding actor complexities.

[More details](./packages/logger/README.md)

---

## Message Handling

A convenient solution for message management within applications, this library introduces decorators for seamless message handler connections. With the power of Reflect Metadata, it guarantees the activation of apt handlers based on message types.

[More details](./packages/message-handling/README.md)

---

## Core Messaging Library

Introduce seamless messaging to your projects. Simplified classes and decorators make it effortless to incorporate and navigate through this tool, catering to varied message interactions.

[More details](./packages/messaging/README.md)

---

## Redis KeyValueStore

`RedisKeyValueStore` delivers a consistent key-value storage facade, leveraging Redis's exceptional speed and performance as the backbone.

[More details](./packages/redis-key-value-store/README.md)

---

## SnsActor

An `Actor` class variation, `SnsActor` is crafted to dispatch messages directly to an AWS Simple Notification Service (SNS) topic.

[More details](./packages/sns-actor/README.md)

---

## SqsActor

An `Actor` class variation, `SqsActor` which provide facilities for processing messages from AWS's SQS and for checking 
message duplication respectively.

[More details](./packages/sqs-actor/README.md)

---

## WireActor

Extending the capabilities of the `Actor` class, `WireActor` plays a crucial role in directing the flow of messages between one writer and several readers.

[More details](./packages/wire-actor/README.md)

---

---

## Nestjs messages service

Nestjs service that allows handling messages for the Actor system.

[More details](./packages/nestjs-messaging/README.md)

For a deeper understanding of each library and its functionalities, please follow the "More details" link associated with each segment. Contributions and feedback are highly valued. Refer to our [contribution guide](./CONTRIBUTING.md) for collaboration details.

Happy coding!
