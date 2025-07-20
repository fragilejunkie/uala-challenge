import nextJest from 'next/jest.js';
const createJestConfig = nextJest({ dir: './' });

export default createJestConfig({
  testEnvironment: 'jest-environment-jsdom',

  // run TS through ts‑jest
  transform: { '^.+\\.tsx?$': 'ts-jest' },

  // stub out SCSS/CSS modules and static files
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy',
    '\\.(svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
});
