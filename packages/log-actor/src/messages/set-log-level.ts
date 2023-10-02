import { Message, MessageArgs, RegisterMessage } from '@anyit/messaging';
import { LogLevel } from '@anyit/logger-interface';

type SetLogLevelArgs = MessageArgs<SetLogLevel>;

@RegisterMessage('01HAVBB240JCTK6JJBBJTX7FGQ')
export class SetLogLevel extends Message {
  constructor(args: SetLogLevelArgs) {
    super(args);

    this.logLevel = args.logLevel;
  }

  readonly logLevel: LogLevel;
}

export const isSetLogLevel = (message?: Message): message is SetLogLevel =>
  Boolean(message && message.code === SetLogLevel.code);
