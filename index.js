const Query = require('./lib/query');
const Postgres = require('./lib/postgres');

module.exports = (databaseURL) => {
  const postgres = new Postgres(databaseURL);
  return new Query(postgres);
};
