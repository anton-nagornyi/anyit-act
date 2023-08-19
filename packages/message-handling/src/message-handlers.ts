import { MessageHandler } from './message-handler';

type Constructor = (new (...args: any[]) => any) | Function;

export class MessageHandlers {
  private static readonly handlersByType = new Map<
    Constructor,
    Map<string, MessageHandler[]>
  >();

  private static readonly handlersByCode = new Map<string, MessageHandler[]>();

  static setHandler(type: Constructor, handler: MessageHandler) {
    const {
      message: { code },
    } = handler;

    const handlers =
      this.handlersByType.get(type) ?? new Map<string, MessageHandler[]>();

    const messageHandlers = handlers.get(code) ?? [];

    messageHandlers.push(handler);

    handlers.set(code, messageHandlers);
    this.handlersByType.set(type, handlers);

    const handlersByCode = this.handlersByCode.get(code) ?? [];
    handlersByCode.push(handler);
    this.handlersByCode.set(code, handlersByCode);
  }

  static getHandlers(type: Constructor, code: string): MessageHandler[] | null;
  static getHandlers(code: string): MessageHandler[] | null;
  static getHandlers(
    typeOrCode: Constructor | string,
    code?: string,
  ): MessageHandler[] | null {
    if (typeof typeOrCode !== 'string' && code !== undefined) {
      const type = typeOrCode;
      const handlers = this.handlersByType.get(type);
      if (!handlers) {
        return null;
      }

      const messageHandlers = handlers.get(code);

      if (!messageHandlers) {
        return null;
      }

      return messageHandlers;
    } else {
      return this.handlersByCode.get(typeOrCode as string) ?? null;
    }
  }
}
