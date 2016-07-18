const router = require('koa-router')();
const s = require('../../utils/generic-middleware-stacks');

const model = 'auditlog';

// See: https://github.com/pillarjs/path-to-regexp for path matching options
router
  .get('/auditlog', s.getAll(model))
  .get('/auditlog/:pk(\\d+)', s.getOne(model))
  // TODO: don't allow deleting post requests
  .del('/auditlog/:pk(\\d+)', s.delete(model));

module.exports = router;
