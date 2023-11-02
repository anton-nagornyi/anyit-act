import { Message } from '@anyit/messaging';

export class AskNoHandlerError extends Error {
  constructor(message: Message) {
    super(`Don't know how to handle ${message.type} (${message.code})`);
  }

  readonly code = 'ASK_NO_HANDLER_ERROR';
}
