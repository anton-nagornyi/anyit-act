import { ErrorMessage, Message, SuccessMessage } from '@anyit/messaging';

export type MessageHandler = {
  class: {
    name: string;
    method: string;
  };
  message: {
    code: string;
    name: string;
  };
  handleFunction: (
    message: Message,
  ) => Promise<void | SuccessMessage | ErrorMessage>;
};
