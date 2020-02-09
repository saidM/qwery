const Query = require('./query');
const Postgres = require('./postgres');

module.exports = (url) => {
  const postgres = new Postgres(url);
  const query = new Query(postgres);
  return query;
};
