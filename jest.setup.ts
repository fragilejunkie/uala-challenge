import '@testing-library/jest-dom';

beforeAll(() => {
  jest.useRealTimers()
});

afterAll(() => {
  jest.useRealTimers();
});