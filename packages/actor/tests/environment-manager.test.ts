import { EnvironmentManager } from '../src/environment/environment-manager';
import { Environment } from '../src/environment/environment';

describe('EnvironmentManager', () => {
  let manager: EnvironmentManager;
  let mockEnvironments: Environment[];

  beforeEach(() => {
    mockEnvironments = [
      { name: 'env1' },
      { name: 'env2' },
      { name: 'env3' },
    ] as Environment[];
    manager = new EnvironmentManager(mockEnvironments);
  });

  describe('getEnvironmentByAddress', () => {
    it('Then it should return null if no address is provided', () => {
      const result = manager.getEnvironmentByAddress();
      expect(result).toBeNull();
    });

    it('Then it should return the environment matching the name extracted from the address', () => {
      const env = manager.getEnvironmentByAddress('env2:some-details');
      expect(env).toBe(mockEnvironments[1]);
    });

    it('Then it should return null if no environment matches the name extracted from the address', () => {
      const env = manager.getEnvironmentByAddress(
        'nonExistentEnv:some-details',
      );
      expect(env).toBeNull();
    });
  });

  describe('getEnvironmentByName', () => {
    it('Then it should return the environment matching the provided name', () => {
      const env = manager.getEnvironmentByName('env3');
      expect(env).toBe(mockEnvironments[2]);
    });

    it('Then it should return null if no environment matches the provided name', () => {
      const env = manager.getEnvironmentByName('nonExistentEnv');
      expect(env).toBeNull();
    });
  });
});
