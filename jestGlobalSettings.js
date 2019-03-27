// Somehow running tests using 'yarn test` takes more time than running them directly with 'jest` from command line
// so this setTimeout() is a workaround for failing due to test timeouts
jest.setTimeout(40000); // 40 seconds