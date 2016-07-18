// Update with your config settings.

require('dotenv').config();

// Turn on ssl default so migrations don't fail on heroku
const pg = require('pg');
pg.defaults.ssl = true;

module.exports = {
  test: {
    client: 'postgresql',
    connection: {
      database: 'fb-chat',
      user:     'taylor',
      charset: 'utf8',
      application_name: 'fb-chat-api',
      debug: process.env.DEBUG || false
    },
    pool: {
      min: 1,
      max: 10,
      idleTimeout: 60000
    }
  },
  development: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 1,
      max: 10,
      idleTimeout: 60000
    }
  },
  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 1,
      max: 10,
      idleTimeout: 60000
    }
  }

};
