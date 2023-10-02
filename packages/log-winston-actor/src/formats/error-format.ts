const winston = require('winston');
const { MESSAGE, LEVEL } = require('triple-beam');

export const errorFormat = winston.format(
  (einfo: any, { stack, cause }: any) => {
    if (einfo instanceof Error) {
      const eany = einfo as any;
      const info = Object.assign({}, einfo, {
        level: eany.level,
        [LEVEL]: eany[LEVEL] || eany.level,
        message: `[${eany.constructor.name}] ${einfo.message}`,
        [MESSAGE]:
          eany[MESSAGE] || `[${eany.constructor.name}] ${einfo.message}`,
      });

      if (stack) info.stack = einfo.stack;
      if (cause) info.cause = einfo.cause;
      return info;
    }

    if (!(einfo.message instanceof Error)) return einfo;

    // Assign all enumerable properties and the
    // message property from the error provided.
    const err = einfo.message;
    Object.assign(einfo, err);
    einfo.message = err.message;
    einfo[MESSAGE] = err.message;

    // Assign the stack and/or cause if requested.
    if (stack) einfo.stack = err.stack;
    if (cause) einfo.cause = err.cause;
    return einfo;
  },
);
