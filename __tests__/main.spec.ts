import { main } from '../src/index';

describe('Main', () => {
  it('should do something', async () => {
    await expect(main()).rejects.toThrowError();
  });
});
