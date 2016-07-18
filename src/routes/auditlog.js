'use strict';

const router = require('koa-router')();
const allow = require('../../middlewares/allow');
const s = require('../../utils/generic-middleware-stacks');

const model = 'marinegeo.auditlog';

// See: https://github.com/pillarjs/path-to-regexp for path matching options
router
  .get('/auditlog', allow('it.team@hakai.org'), s.getAll(model))
  .get('/auditlog/:pk(\\d+)', allow('it.team@hakai.org'), s.getOne(model))
  // TODO: don't allow deleting post requests
  .del('/auditlog/:pk(\\d+)', allow('taylor.denouden@hakai.org'), s.delete(model));

module.exports = router;
