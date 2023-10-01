import { Actor } from '../src/actor';
import { ActorSystem } from '../src/actor-system';

describe('ActorSystem', () => {
  describe('resolve', () => {
    beforeEach(() => {
      ActorSystem.create(Actor, { address: 'some-address' });
    });

    it('Then it should resolve actor and return its reference', () => {
      expect(ActorSystem.resolve('some-address')).not.toBeNull();
    });
  });

  describe('getRef', () => {
    it('Then it should return actor reference for given address', () => {
      expect(ActorSystem.getRef('some-address')).not.toBeNull();
    });
  });

  describe('create', () => {
    it('Then it should create actor and return its reference', () => {
      expect(ActorSystem.create(Actor)).not.toBeNull();
    });
  });
});
