require('dotenv').config();

const winston = require('winston');

// config
winston.level = process.env.LOG_LEVEL;

module.exports = winston;
