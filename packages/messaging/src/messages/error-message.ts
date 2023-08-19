import { Message, MessageArgs } from './message';
import { RegisterMessage } from '../decorators/register-message';

type ErrorMessageArgs = MessageArgs<ErrorMessage>;

@RegisterMessage('01H7J0E0RK84PTTBB5SV4ABWWV')
export class ErrorMessage extends Message {
  constructor(args: ErrorMessageArgs) {
    super(args);

    this.error = args.error;
  }

  readonly error: Error;
}

export const isErrorMessage = (
  message?: Message | void,
): message is ErrorMessage =>
  Boolean(
    message &&
      (message.code === ErrorMessage.code || message instanceof ErrorMessage),
  );
