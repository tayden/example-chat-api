const cors = require('koa-cors');

module.exports = cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
});
