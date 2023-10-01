import { Environment } from './environment';

export class EnvironmentManager {
  constructor(private readonly environments: Environment[]) {}

  getEnvironmentByAddress(address?: string | null) {
    if (!address) {
      return null;
    }

    const [name] = address.split(':');
    return this.getEnvironmentByName(name);
  }

  getEnvironmentByName(name: string) {
    for (const env of this.environments) {
      if (env.name === name) {
        return env;
      }
    }
    return null;
  }
}
