module.exports = {
  preset: '@react-native/jest-preset',
  watchman: false,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((@)?react-native|@react-native(-community)?|@react-navigation|react-native-vector-icons)/)',
  ],
};
