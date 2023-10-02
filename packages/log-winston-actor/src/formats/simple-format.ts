const winston = require('winston');
const { MESSAGE, SPLAT } = require('triple-beam');
const jsonStringify = require('safe-stable-stringify');

const getIsSplatMergable = (splat: any[]) => {
  for (let i = 0; i < splat.length - 1; ++i) {
    if (splat[i] === undefined || splat[i] === null) {
      return false;
    }

    if (typeof splat[i] !== 'object') {
      return false;
    }
  }
  return true;
};

export const simpleFormat = winston.format((info: any) => {
  const splat = info[SPLAT];
  let meta: any;

  if (splat) {
    const isSplatMergable = getIsSplatMergable(splat);

    if (!isSplatMergable) {
      meta = splat;
    } else {
      if (splat.length === 1) {
        meta = splat[0];
      } else if (splat.length > 1) {
        meta = {};
        for (let i = 0; i < splat.length; ++i) {
          Object.assign(meta, JSON.parse(jsonStringify(splat[i])));
        }
      }
    }
  }

  const padding = (info.padding && info.padding[info.level]) || '';
  const output = [`${info.level}:${padding}`];

  if (info.message) {
    output.push(info.message);
  }

  if (meta) {
    if (Array.isArray(meta)) {
      if (meta.length > 0) {
        const metaOutput = [];
        for (let i = 0; i < meta.length; ++i) {
          const data = meta[i];
          if (data === null) {
            metaOutput.push('null');
            continue;
          }

          if (data === undefined) {
            metaOutput.push('undefined');
            continue;
          }

          if (typeof data === 'object') {
            metaOutput.push(jsonStringify(data));
            continue;
          }

          metaOutput.push(data);
        }
        output.push(metaOutput.join(','));
      }
    } else {
      output.push(jsonStringify(meta));
    }
  }

  info[MESSAGE] = output.join(' ');

  return info;
});
