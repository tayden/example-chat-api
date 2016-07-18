const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const logger = require('../utils/logger');

// Import all routes and load all routes
logger.debug('Loading routes');
let dirs = fs.readdirSync(__dirname)
  .filter(x => fs.lstatSync(path.join(__dirname, x)).isDirectory())
  .filter(d => (d.indexOf('.') !== 0));

dirs.forEach(dir => {
  let files = fs.readdirSync(path.join(__dirname, dir))
    .filter(x => fs.lstatSync(path.join(__dirname, dir, x)).isFile())
    .filter(f => (f.indexOf('.') !== 0));

  files.forEach(file => {
    let route = require(path.join(__dirname, dir, file));
    route.stack.forEach((layer) => {
      logger.debug('\t', layer.methods[layer.methods.length-1], layer.path);
    });
    router.use(`/${dir}`, route.routes(), route.allowedMethods());
  });
});

let files = fs.readdirSync(__dirname)
  .filter(x => fs.lstatSync(path.join(__dirname, x)).isFile())
  .filter(d => (d.indexOf('.') !== 0))
  .filter(d => (d !== 'index.js'));

files.forEach(file => {
  let route = require(path.join(__dirname, file));
  // route.stack.forEach((layer) => {
  //   logger.debug('\t', layer.methods[layer.methods.length-1], layer.path);
  // });
  router.use(route.routes(), route.allowedMethods());
});

module.exports = router;
