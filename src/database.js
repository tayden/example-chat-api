// Connect and export postgres database connection
const Knex = require('knex');
const pg = require('pg');
pg.defaults.ssl = true;

var environment = process.env.NODE_ENV || 'development';
module.exports = Knex(require('../knexfile.js')[environment]);
