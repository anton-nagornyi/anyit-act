export const inspectSymbol =
  typeof process !== 'undefined' && process.release.name === 'node'
    ? Symbol.for('nodejs.util.inspect.custom')
    : Symbol('browser.util.inspect.custom');
