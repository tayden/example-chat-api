const router = require('koa-router')();
const s = require('../utils/generic-middleware-stacks');

const model = 'message';

// See: https://github.com/pillarjs/path-to-regexp for path matching options
router
  .get('/message', s.getAll(model))
  .post('/message', s.post(model))

  .get('/message/:pk(\\d+)', s.getOne(model))
  .put('/message/:pk(\\d+)', s.put(model))
  .del('/message/:pk(\\d+)', s.delete(model));

module.exports = router;
