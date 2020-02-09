const pgp = require('pg-promise')({});

class Postgres {
  constructor(url) {
    this.db = pgp(url);
  }

  async exec({ query, params }) {
    try {
      return await this.db.any(query, params);
    } catch (err) {
      throw new Error(/Invalid SQL Request/);
    }
  }

  async single({ query, params }) {
    try {
      const data = await this.db.any(query, params);
      return data[0];
    } catch (err) {
      throw new Error(/Invalid SQL Request/);
    }
  }
}

module.exports = Postgres;
