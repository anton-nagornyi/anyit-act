# `anyit-messaging` Library Documentation

---

## **Constants**

### `WIRE_ACTOR`

- Description: A constant provider identifier for the `wire` actor reference.

### `KEY_VALUE_ACTOR`

- Description: A constant provider identifier for the `keyValue` actor reference.

### `ANYIT_LOGGER`

- Description: A constant optional provider identifier for the logger.


## **MessagingService**

### **Overview**

The `MessagingService` is responsible for message interaction using the Actor model.

### **Constructor**

- `wire`: An actor reference.
- `keyValue`: An actor reference.
- `logger` (optional): Logger instance. Defaults to `SilentLogger`.

### **Methods**

#### `tell(message: Message)`

Sends a message to the `wire` actor.
