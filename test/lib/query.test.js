const Query = require('../../lib/query');
const Postgres = require('../../lib/postgres');

const postgres = new Postgres('postgres://saidmimouni:@localhost:5432/qwery');

describe('constructor', () => {
  it('takes a Postgres instance object as a parameter', () => {
    expect(() => {
      new Query();
    }).toThrow(/Missing Database URL/);
    expect(() => {
      new Query(postgres);
    }).not.toThrow();
  });
});

describe('select()', () => {
  it('returns a correctly formatted SQL query', () => {
    let query = new Query(postgres).select('*').from('users');
    expect(query.toString()).toEqual({
      query: 'SELECT * FROM users',
      params: [],
    });
    query = new Query(postgres).select('*').from('users').where({ active: true });
    expect(query.toString()).toEqual({
      query: 'SELECT * FROM users WHERE active = $1',
      params: [true],
    });
    query = new Query(postgres).select('*').from('users').where({ active: true, trialing: false });
    expect(query.toString()).toEqual({
      query: 'SELECT * FROM users WHERE active = $1 AND trialing = $2',
      params: [true, false],
    });
    query = new Query(postgres).select('id, name').from('users').where({ active: true, trialing: false });
    expect(query.toString()).toEqual({
      query: 'SELECT id, name FROM users WHERE active = $1 AND trialing = $2',
      params: [true, false],
    });
    query = new Query(postgres).select(['id', 'name']).from('users').where({ active: true, trialing: false });
    expect(query.toString()).toEqual({
      query: 'SELECT id, name FROM users WHERE active = $1 AND trialing = $2',
      params: [true, false],
    });
  });
});

describe('insert()', () => {
  it('returns a correctly formatted SQL query', () => {
    expect(new Query(postgres).insert('users').values({ email: 'me@gmail.com' }).toString()).toEqual({
      query: 'INSERT INTO users ( email ) VALUES ( $1 )',
      params: ['me@gmail.com'],
    });
    expect(new Query(postgres).insert('users').values({ id: 123, email: 'me@gmail.com' }).toString()).toEqual({
      query: 'INSERT INTO users ( id, email ) VALUES ( $1, $2 )',
      params: [123, 'me@gmail.com'],
    });
  });
});

describe('delete()', () => {
  it('returns a correctly formatted SQL query', () => {
    expect(new Query(postgres).delete('users').where({ email: 'me@gmail.com' }).toString()).toEqual({
      query: 'DELETE FROM users WHERE email = $1',
      params: ['me@gmail.com'],
    });
  });
});

describe('update()', () => {
  it('returns a correctly formatted SQL query', () => {
    let query = new Query(postgres).update('users').set({ email: 'john@doe.com' }).where({ email: 'me@gmail.com' });
    expect(query.toString()).toEqual({
      query: 'UPDATE users SET email = $1 WHERE email = $2',
      params: ['john@doe.com', 'me@gmail.com'],
    });
    query = new Query(postgres).update('users').set({ active: false, email: 'john@doe.com' }).where({ email: 'me@gmail.com' });
    expect(query.toString()).toEqual({
      query: 'UPDATE users SET active = $1, email = $2 WHERE email = $3',
      params: [false, 'john@doe.com', 'me@gmail.com'],
    });
    query = new Query(postgres).update('users').set({ active: false, email: 'john@doe.com' }).where({ id: 1, email: 'me@gmail.com' });
    expect(query.toString()).toEqual({
      query: 'UPDATE users SET active = $1, email = $2 WHERE id = $3 AND email = $4',
      params: [false, 'john@doe.com', 1, 'me@gmail.com'],
    });
  });
});

describe('exec()', () => {
  it('calls the toString() method', async () => {
    const query = new Query(postgres).select('*').from('users');
    const spy = jest.spyOn(query, 'toString');

    await query.exec();
    expect(spy).toHaveBeenCalled();
  });

  it('calls the postgres.exec() method', async () => {
    const query = new Query(postgres).select('*').from('users');
    const spy = jest.spyOn(postgres, 'exec');

    await query.exec();
    expect(spy).toHaveBeenCalled();
  });
});
