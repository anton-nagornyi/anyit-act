import 'reflect-metadata';
import { MessageHandler } from './message-handler';
import { ReasonChecker } from './reason-checker';
import { HandlersEventEmitter } from './handlers-event-emitter';
import { ErrorChecker } from './error-checker';

type Constructor = (new (...args: any[]) => any) | Function;

export class MessageHandlers {
  private static readonly handlersByType = new Map<
    Constructor,
    Map<string, MessageHandler[]>
  >();

  private static readonly reasonCheckersByType = new Map<
    Constructor,
    Map<string, ReasonChecker[]>
  >();

  private static readonly errorCheckersByType = new Map<
    Constructor,
    Map<string, ErrorChecker[]>
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

  /** @internal */
  static setReasonChecker(type: Constructor, checker: ReasonChecker) {
    const checkers =
      this.reasonCheckersByType.get(type) ?? new Map<string, ReasonChecker[]>();

    const reasonCheckers = checkers.get(checker.class.method) ?? [];

    reasonCheckers.push(checker);

    checkers.set(checker.class.method, reasonCheckers);
    this.reasonCheckersByType.set(type, checkers);
  }

  /** @internal */
  static setErrorChecker(type: Constructor, checker: ErrorChecker) {
    const checkers =
      this.errorCheckersByType.get(type) ?? new Map<string, ErrorChecker[]>();

    const errorCheckers = checkers.get(checker.class.method) ?? [];

    errorCheckers.push(checker);

    checkers.set(checker.class.method, errorCheckers);
    this.errorCheckersByType.set(type, checkers);
  }

  /** @internal */
  static getReasonChecker(type: Constructor, method: string) {
    return this.reasonCheckersByType.get(type)?.get(method);
  }

  /** @internal */
  static getErrorCheckers(type: Constructor, method: string) {
    return this.errorCheckersByType.get(type)?.get(method);
  }

  static readonly events = new HandlersEventEmitter();
}
