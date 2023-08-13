let crypto: { randomUUID: () => string };

if (typeof window !== 'undefined' && window.crypto) {
  crypto = window.crypto;
} else {
  crypto = require('crypto');
}

export const randomUuid = () => {
  return crypto.randomUUID();
};
