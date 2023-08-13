export class MessageDeserializeError extends Error {
  constructor(data: object) {
    super(
      `[Messages]: can't create message from input: ${JSON.stringify(data)}`,
    );
  }
}
