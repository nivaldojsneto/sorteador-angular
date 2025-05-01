globalThis.ngJest = {
  skipNgcc: true,
  tsconfig: 'tsconfig.spec.json', // esta é a raiz do projeto tsconfig
};

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transformar somente arquivos .ts
  },
  transformIgnorePatterns: [
    '/node_modules/(?!flat)/', // Excluir módulos, exceto 'flat', da transformação
  ],
  moduleDirectories: ['node_modules', 'src'],
  fakeTimers: {
    enableGlobally: true,
  },
};
