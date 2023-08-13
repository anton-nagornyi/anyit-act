import { MessageType, Message } from './messages/message';
import { MessageDeserializeError } from './errors/message-deserialize-error';

export class MessageFactory {
  private static knownMessages = new Map<string, MessageType>();

  /** internal */
  static register(code: string, type: MessageType) {
    MessageFactory.knownMessages.set(code, type);
  }

  /** internal */
  static getMessageType(code: string): MessageType | null {
    return MessageFactory.knownMessages.get(code) ?? null;
  }

  static create(input: { [key: string]: any }) {
    const { code } = input;

    const MessageConstructor = MessageFactory.knownMessages.get(
      code,
    ) as unknown as new (args: { [key: string]: any }) => Message;

    if (!MessageConstructor) {
      throw new MessageDeserializeError(input);
    }

    return new MessageConstructor(input);
  }
}
