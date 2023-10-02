import { Message, MessageArgs, RegisterMessage } from '@anyit/messaging';
import { LogLevel } from '@anyit/logger-interface';

type LogMessageArgs = MessageArgs<LogMessage>;

@RegisterMessage('01H7MBTT9GEZWD9C9NSBZNF8P0')
export class LogMessage extends Message {
  constructor(args: LogMessageArgs) {
    super(args);

    this.message = args.message;
    this.meta = args.meta?.length === 0 ? undefined : args.meta;
    this.level = args.level;
  }

  readonly message?: any;

  readonly meta?: any[];

  readonly level: Exclude<LogLevel, 'silent'>;
}

export const isLogMessage = (message?: Message): message is LogMessage =>
  Boolean(message && message.code === LogMessage.code);
