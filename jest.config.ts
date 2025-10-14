export default {
  extensionsToTreatAsEsm: ['.ts'],
  verbose: true,
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: true }]
  },
  testPathIgnorePatterns: ['./dist'],
  moduleNameMapper: {
  '^(\\.{1,2}/.*)\\.js$': '$1',
}
}
