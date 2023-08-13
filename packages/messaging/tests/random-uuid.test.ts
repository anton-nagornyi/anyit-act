jest.mock('crypto');

describe('Given the randomUuid function', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  describe('When executed in a browser environment with window.crypto', () => {
    let randomUuid: () => string;
    beforeEach(() => {
      // Mock global window object
      global.window = {
        crypto: {
          randomUUID: jest.fn().mockReturnValue('mocked-uuid-browser'),
        },
      } as any;

      ({ randomUuid } = require('../src/random-uuid'));
    });

    it('Then it should use window.crypto to generate UUID', () => {
      const uuid = randomUuid();
      expect(uuid).toBe('mocked-uuid-browser');
      expect(window.crypto.randomUUID).toHaveBeenCalledTimes(1);
    });
  });

  describe('When executed in a browser environment without window.crypto', () => {
    let randomUuid: () => string;
    beforeEach(() => {
      // Mock global window object without crypto
      global.window = {} as any;

      const nodeCrypto = require('crypto');
      nodeCrypto.randomUUID = jest.fn().mockReturnValue('mocked-uuid-node');

      ({ randomUuid } = require('../src/random-uuid'));
    });

    it('Then it should use Node crypto to generate UUID', () => {
      const uuid = randomUuid();
      expect(uuid).toBe('mocked-uuid-node');

      const nodeCrypto = require('crypto');
      expect(nodeCrypto.randomUUID).toHaveBeenCalledTimes(1);
    });
  });

  describe('When executed in a non-browser environment', () => {
    let randomUuid: () => string;

    beforeEach(() => {
      delete (global as any).window;

      const nodeCrypto = require('crypto');
      nodeCrypto.randomUUID = jest.fn().mockReturnValue('mocked-uuid-node');

      ({ randomUuid } = require('../src/random-uuid'));
    });

    it('Then it should use Node crypto to generate UUID', () => {
      const uuid = randomUuid();
      expect(uuid).toBe('mocked-uuid-node');

      const nodeCrypto = require('crypto');
      expect(nodeCrypto.randomUUID).toHaveBeenCalledTimes(1);
    });
  });
});
