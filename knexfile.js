// Turn on ssl default so migrations don't fail on heroku
const pg = require('pg');
pg.defaults.ssl = true;

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
};
