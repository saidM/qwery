class Query {
  constructor(postgres) {
    if (!postgres) throw new Error('Missing Database URL');
    this.queryParts = [];
    this.params = [];
    this.postgres = postgres;
  }

  from(table) {
    this.queryParts.push(`FROM ${table}`);
    return this;
  }

  select(columns) {
    if (Array.isArray(columns)) {
      this.queryParts.push(`SELECT ${columns.join(', ')}`);
    } else {
      this.queryParts.push(`SELECT ${columns}`);
    }
    return this;
  }

  where(conditions = {}) {
    Object.entries(conditions).forEach(([key, value], index) => {
      const keyword = index === 0 ? 'WHERE' : 'AND';
      this.queryParts.push(`${keyword} ${key} = $${this.params.length + 1}`);
      this.params.push(value);
    });
    return this;
  }

  insert(table) {
    this.queryParts.push(`INSERT INTO ${table} (`);
    return this;
  }

  values(columns) {
    const keys = [];
    Object.keys(columns).forEach((key) => {
      keys.push(key);
    });

    this.queryParts.push(keys.join(', '));
    this.queryParts.push(') VALUES (');

    const values = [];
    Object.values(columns).forEach((value, index) => {
      values.push(`$${index + 1}`);
      this.params.push(value);
    });

    this.queryParts.push(values.join(', '));
    this.queryParts.push(')');
    return this;
  }

  delete(table) {
    this.queryParts.push(`DELETE FROM ${table}`);
    return this;
  }

  update(table) {
    this.queryParts.push(`UPDATE ${table} SET`);
    return this;
  }

  set(columns) {
    const values = [];
    Object.entries(columns).forEach(([key, value], index) => {
      values.push(`${key} = $${index + 1}`);
      this.params.push(value);
    });

    this.queryParts.push(values.join(', '));
    return this;
  }

  toString() {
    return {
      query: this.queryParts.join(' '),
      params: this.params,
    };
  }

  exec() {
    return this.postgres.exec(this.toString());
  }

  single() {
    return this.postgres.single(this.toString());
  }
}

module.exports = Query;
