import '@testing-library/jest-dom';

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2023-10-29T00:00:00Z')); // 1 day after newest mock
});

afterAll(() => {
  jest.useRealTimers();
});