import { MessageHandlers } from '../message-handlers';

type ErrorRaised = new (...args: any[]) => Error;

const destructArgs = function (args: any[]): [(typeof Error)[], number] {
  if (args.length === 1) {
    const [arg] = args;
    if (arg.code || arg.prototype instanceof Error) {
      return [[arg], 2];
    }

    return [arg.errors, arg.parameterIndex];
  }
  return [args, 2];
};

export function ErrorRaisedFilter(...errors: ErrorRaised[]): MethodDecorator;
export function ErrorRaisedFilter(args: {
  errors: ErrorRaised[];
  parameterIndex: number;
}): MethodDecorator;

export function ErrorRaisedFilter(...args: any): MethodDecorator {
  const [errors, parameterIndex] = destructArgs(args);

  return (target: any, propertyKey: string | symbol) => {
    errors.forEach((error) => {
      MessageHandlers.setErrorChecker(target.constructor, {
        class: {
          name: target.constructor.name,
          method: propertyKey as string,
        },
        error: error,
        parameterIndex,
      } as const);
    });
  };
}
