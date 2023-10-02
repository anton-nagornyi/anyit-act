# Key-Value Actor Library Documentation

The Key-Value Actor Library offers an abstracted, message-driven approach to managing key-value pairs. Utilizing the
Actor Model paradigm, it enables asynchronous communication, fault-tolerance, and modular design in handling data 
operations.

The library comes equipped with:

- **KeyValueActor**: An actor responsible for handling key-value operations such as set, get, and delete.
- **InMemoryKeyValueStore**: A simple in-memory store to keep the key-value pairs, with an option to expand with 
other storage solutions.
- **Messages**: Defined messages to communicate with the KeyValueActor, ensuring a strict protocol and predictable
behaviors.
- **Error Handling**: Integrated exception management to handle missing keys and other potential issues.

Whether you are building a caching solution, a configuration manager, or a simple in-memory database, 
the Key-Value Actor Library provides a robust foundation for your needs.

## Table of Contents
1. [KeyIsMissingError](#KeyIsMissingError)
2. [DeleteKey](#DeleteKey)
3. [DeleteKeySuccess](#DeleteKeySuccess)
4. [GetMultipleValues](#GetMultipleValues)
5. [GetMultipleValuesSuccess](#GetMultipleValuesSuccess)
6. [GetValue](#GetValue)
7. [GetValueSuccess](#GetValueSuccess)
8. [SetValue](#SetValue)
9. [SetValueSuccess](#SetValueSuccess)
10. [InMemoryKeyValueStore](#InMemoryKeyValueStore)
11. [KeyValueStore](#KeyValueStore)
12. [KeyValueStoreOptions](#KeyValueStoreOptions)
13. [Pattern](#Pattern)
14. [KeyValueActor](#KeyValueActor)
15. [Usage examples](#usage-examples)

## KeyIsMissingError

```typescript
constructor(key: string)
```
- `key`: The key which is missing in the store.

## DeleteKey

Message class to represent the intention of deleting a key from the store.

**Attributes**:
- `key`: Key to be deleted from the store.
- `pattern`: Optional pattern to be used when deleting the key.

## DeleteKeySuccess

Message class to represent the successful deletion of a key from the store.

**Attributes**:
- `key`: Key that has been deleted from the store.

## GetMultipleValues

Message class to represent the intention of getting multiple values from the store.

**Attributes**:
- `keys`: Array of keys to get values for.

## GetMultipleValuesSuccess

Message class to represent the successful retrieval of multiple values from the store.

**Attributes**:
- `keyValues`: A record of keys and their associated values or errors.

## GetValue

Message class to represent the intention of getting a value from the store for a specific key.

**Attributes**:
- `key`: The key to get the value for.

## GetValueSuccess

Message class to represent the successful retrieval of a value from the store.

**Attributes**:
- `key`: The key for which the value was retrieved.
- `value`: The retrieved value.

## SetValue

Message class to represent the intention of setting a value in the store for a specific key.

**Attributes**:
- `key`: The key for which the value should be set.
- `value`: The value to be set.
- `options`: Optional settings for setting the value, like ttl.

## SetValueSuccess

Message class that extends `SetValue` to represent the successful setting of a value in the store.

## InMemoryKeyValueStore

An in-memory implementation of the KeyValueStore.

**Methods**:
- `delete(key: string, pattern?: Pattern)`: Deletes a key or keys matching a pattern from the store. Throws `KeyIsMissingError` if the key is not found.
- `get(key: string)`: Retrieves a value for a given key from the store. Throws `KeyIsMissingError` if the key is not found.
- `set(key: string, value: any, options?: KeyValueStoreOptions)`: Sets a value for a given key in the store. If ttl is provided in options, the key will be removed after the specified ttl.

## KeyValueStore

**Description**:  
Abstract base class representing a key-value store.

**Methods**:
- `set(key: string, value: any, options?: KeyValueStoreOptions)`: Sets a value in the store.
- `get(key: string)`: Retrieves a value from the store.
- `delete(key: string, pattern?: Pattern)`: Deletes a value from the store.

## KeyValueStoreOptions

Options for key-value store operations.

**Attributes**:
- `ttl?`: Time-to-live in milliseconds. Optional.

## Pattern

Enum representing different patterns.

**Values**:
- `glob`

## KeyValueActor

Actor class to handle key-value store operations.

**Methods**:
- `setValue(@Receive message: SetValue)`: Handles setting a value in the store.
- `getValue(@Receive message: GetValue)`: Handles getting a value from the store.
- `getMultipleValues(@Receive message: GetMultipleValues)`: Handles getting multiple values from the store.
- `deleteKey(@Receive message: DeleteKey)`: Handles deleting a key from the store.


# Usage Examples

## Setting a Value

```typescript
import { ActorSystem } from '@anyit/actor-system';
import { KeyValueActor, SetValue } from '@anyit/key-value-actor';

const actor = ActorSystem.create(KeyValueActor);

// Setting a key-value pair
const setMsg = new SetValue({ key: 'user123', value: { name: 'Alice', age: 28 } });
actor.tell(setMsg);
```

## Getting a Value

```typescript
import { ActorSystem } from '@anyit/actor-system';
import { KeyValueActor, GetValue } from '@anyit/key-value-actor';

const actor = ActorSystem.create(KeyValueActor);

// Fetching the value for a key
const getMsg = new GetValue({ key: 'user123' });
actor.tell(getMsg);
```

## Deleting a Key

```typescript
import { ActorSystem } from '@anyit/actor-system';
import { KeyValueActor, DeleteKey } from '@anyit/key-value-actor';

const actor = ActorSystem.create(KeyValueActor);

// Deleting a key-value pair
const delMsg = new DeleteKey({ key: 'user123' });
actor.tell(delMsg);
```

## Setting a Value with TTL

```typescript
import { ActorSystem } from '@anyit/actor-system';
import { KeyValueActor, SetValue } from '@anyit/key-value-actor';

const actor = ActorSystem.create(KeyValueActor);

// Setting a key-value pair with a Time-to-Live of 5 minutes (300000 milliseconds)
const setMsg = new SetValue({ key: 'session456', value: { status: 'active' }, options: { ttl: 300000 } });
actor.tell(setMsg);
```

## Fetching Multiple Values

```typescript
import { ActorSystem } from '@anyit/actor-system';
import { KeyValueActor, GetMultipleValues } from '@anyit/key-value-actor';

const actor = ActorSystem.create(KeyValueActor);

// Fetching values for multiple keys
const getMultiMsg = new GetMultipleValues({ keys: ['user123', 'session456'] });
actor.tell(getMultiMsg);
```
