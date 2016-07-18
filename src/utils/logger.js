const winston = require('winston');

// config
winston.level = process.env.LOG_LEVEL || 'warning';

module.exports = winston;
