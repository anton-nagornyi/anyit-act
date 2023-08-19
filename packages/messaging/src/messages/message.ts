import { CODE } from '../symbols/internal-symbols';
import { DateTime } from 'luxon';
import { MessageFactory } from '../message-factory';
import { randomUuid } from '../random-uuid';
import { inspectSymbol } from '../symbols/inspect-custom-symbol';

type ReplaceDateTime<T> = {
  [K in keyof T]: T[K] extends Array<DateTime>
    ? Array<string | DateTime>
    : T[K] extends DateTime
    ? string | DateTime
    : T[K] extends DateTime | undefined
    ? string | DateTime | undefined
    : T[K];
};

type ReplaceMessageTypes<T extends Message> = {
  [K in keyof T]: T[K] extends Array<MessageType<T>>
    ? Array<string | MessageType<T>>
    : T[K] extends MessageType<T>
    ? string | MessageType<T>
    : T[K];
};

export type MessageArgs<T extends Message = Message> = Omit<
  ReplaceDateTime<ReplaceMessageTypes<T>>,
  | 'type'
  | 'code'
  | 'toJSON'
  | 'messageId'
  | 'getDateTimeFromIso'
  | 'getDateTimeFromIsoArray'
  | 'getMessageType'
  | 'getMessageTypes'
> & { messageId?: string };

export abstract class Message {
  constructor(args?: MessageArgs) {
    if (args instanceof Message) {
      this.messageId = randomUuid();
    } else {
      this.messageId = args?.messageId || randomUuid();
    }

    this.traceId = args?.traceId ?? args?.reason?.traceId;

    this.createdAt = this.getDateTimeFromIso(args?.createdAt);

    this.reasonId = args?.reasonId;

    if (args?.reason instanceof Message) {
      this.reason = args.reason;
    } else if (args?.reason) {
      this.reason = MessageFactory.create(args.reason);
    }
  }

  protected getDateTimeFromIso(iso?: string | DateTime) {
    if (iso) {
      return typeof iso === 'string'
        ? DateTime.fromISO(iso)
        : (iso as DateTime);
    } else {
      return DateTime.utc();
    }
  }

  protected getDateTimeFromIsoArray(iso?: ReadonlyArray<string | DateTime>) {
    if (!iso) {
      return [];
    }
    return iso.map((date) => this.getDateTimeFromIso(date));
  }

  protected getMessageType(messageType: string | MessageType) {
    if (typeof messageType === 'string') {
      return MessageFactory.getMessageType(messageType);
    }

    return messageType;
  }

  protected getMessageTypes(messageTypes: ReadonlyArray<string | MessageType>) {
    return messageTypes
      .map((messageType) => this.getMessageType(messageType))
      .filter((messageType) => messageType) as ReadonlyArray<MessageType>;
  }

  readonly messageId: string;

  readonly traceId?: string;

  readonly createdAt?: DateTime;

  readonly reason?: Message;

  readonly reasonId?: string;

  get type() {
    return this.constructor.name;
  }

  static get code() {
    return (this as any)[CODE];
  }

  get code() {
    return (this.constructor as any)[CODE];
  }

  [inspectSymbol]() {
    return this.toString();
  }

  toJSON() {
    return {
      type: this.type,
      code: this.code,
      ...(this as any),
    };
  }

  toString() {
    return JSON.stringify(this.toJSON());
  }
}

export type MessageType<T extends Message = Message> = (new (
  ...args: any[]
) => T) & { readonly code: string };
