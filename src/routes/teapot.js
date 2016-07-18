'use strict';

const router = require('koa-router')();

// See: https://github.com/pillarjs/path-to-regexp for path matching options
router
  .get('/teapot', function *(next){
    this.status = 418;
    yield next;
  });

module.exports = router;
