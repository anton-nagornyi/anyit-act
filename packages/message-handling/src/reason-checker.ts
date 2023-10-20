export type ReasonChecker = {
  class: {
    name: string;
    method: string;
  };
  reason: {
    code: string;
    name: string;
    parameterIndex?: number;
  };
};
