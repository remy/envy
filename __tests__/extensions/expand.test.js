process.env.NODE_ENV = 'foo';
process.chdir(__dirname);
require('../../');

test('reads local over all others', () => {
  expect(process.env.BASIC).toBe('basic');
  expect(process.env.BASIC_EXPAND).toBe('basic');
  expect(process.ESCAPED_EXPAND).toBe(undefined);
});

afterAll(() => {
  delete process.env.ENV;
  delete process.env.BASIC_EXPAND;
  delete process.env.BASIC;
  delete process.env.ESCAPED_EXPAND;
});
