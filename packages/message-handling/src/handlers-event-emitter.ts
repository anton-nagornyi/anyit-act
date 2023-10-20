import { EventEmitter } from './event-emitter';
import { Message } from '@anyit/messaging';

type EventMap = {
  beforeHandling: (
    message: Message,
    handler: { class: string; method: string },
  ) => void;

  afterHandling: (
    message: Message,
    handler: { class: string; method: string },
  ) => void;
};

export class HandlersEventEmitter extends EventEmitter<EventMap> {}
