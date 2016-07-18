const parse = require('co-body');

// Parse the xml body into JSON and store on this.state.data for use by create_action
module.exports = function *parseBody(next) {
  if(this.request.method === 'POST' || this.request.method === 'PUT') {
    this.request.body = yield parse.text(this);
  }
  else {
    this.request.body = {};
  }
  yield next;
};
