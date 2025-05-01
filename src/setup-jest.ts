import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

Object.defineProperty(window, 'Audio', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    play: jest.fn().mockResolvedValue(undefined),
  })),
});
