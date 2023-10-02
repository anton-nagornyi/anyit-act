export class MessageIsAlreadyReceived extends Error {
  constructor(messageId: string) {
    super(`[SQS]: Message is already received: "${messageId}"`);
  }
}
