const Postgres = require('../../lib/postgres');

const postgres = new Postgres('postgres://saidmimouni:@localhost:5432/qwery');

describe('Postgres', () => {
  it('is a class', () => {
    expect(Postgres.toString()).toMatch(/class Postgres.+/);
  });

  describe('exec()', () => {
    describe('when query is invalid', () => {
      it('returns a rejected promise', async () => {
        await expect(postgres.exec({ query: 'invalid request' })).rejects.toThrow(/Invalid SQL Request/);
      });
    });

    it('returns a resolved promise', async () => {
      await expect(postgres.exec({ query: 'select 1+1 as sum' })).resolves.toEqual([{ sum: 2 }]);
    });
  });

  describe('single()', () => {
    describe('when query is invalid', () => {
      it('returns a rejected promise', async () => {
        await expect(postgres.single({ query: 'invalid request' })).rejects.toThrow(/Invalid SQL Request/);
      });
    });

    it('returns a resolved promise', async () => {
      await expect(postgres.single({ query: 'select 1+1 as sum' })).resolves.toEqual({ sum: 2 });
    });
  });
});
