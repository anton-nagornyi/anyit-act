export type ErrorChecker = {
  class: {
    name: string;
    method: string;
  };
  error: typeof Error;
  parameterIndex?: number;
};
