import { Message } from '@anyit/messaging';

export class AskTimeoutError extends Error {
  constructor(message: Message, timeout: number) {
    super(`${message.type} (${message.code}) was not handled in ${timeout}`);
  }

  readonly code = 'ASK_TIMEOUT_ERROR';
}
