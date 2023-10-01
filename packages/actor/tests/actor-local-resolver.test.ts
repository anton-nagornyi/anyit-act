import { ActorLocalResolver } from '../src/environment/actor-local-resolver';
import { Actor } from '../src/actor';

describe('ActorLocalResolver', () => {
  let resolver: ActorLocalResolver;
  let mockActor: Actor;

  beforeEach(() => {
    resolver = new ActorLocalResolver();
    mockActor = {
      address: 'local:testAddress',
    } as Actor;
  });

  describe('register', () => {
    it('Then it should register an actor with a given address', () => {
      resolver.register(mockActor);
      const result = resolver.resolve<Actor>(mockActor.address);
      expect(result).toBe(mockActor);
    });
  });

  describe('resolve', () => {
    it('Then it should resolve and return an actor if registered', () => {
      resolver.register(mockActor);
      const result = resolver.resolve<Actor>(mockActor.address);
      expect(result).toBe(mockActor);
    });

    it('Then it should return null if actor is not registered', () => {
      const result = resolver.resolve<Actor>('someNonExistentAddress');
      expect(result).toBeNull();
    });
  });

  describe('getNewAddress', () => {
    it('Then it should return a new address with incremented id if no address is provided', () => {
      const address1 = resolver.getNewAddress();
      expect(address1).toBe('local:1');

      const address2 = resolver.getNewAddress();
      expect(address2).toBe('local:2');
    });

    it('Then it should prepend "local:" to an address if it does not start with "local"', () => {
      const address = resolver.getNewAddress('testAddress');
      expect(address).toBe('local:testAddress');
    });

    it('Then it should return the same address if it already starts with "local"', () => {
      const originalAddress = 'local:original';
      const address = resolver.getNewAddress(originalAddress);
      expect(address).toBe(originalAddress);
    });
  });
});
