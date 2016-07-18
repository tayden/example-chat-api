require('dotenv').config();

// Connect and export postgres database connection
var environment = process.env.NODE_ENV || 'development';
var config = require('../knexfile.js')[environment];

module.exports = require('knex')(config);
