const handler = require('../action-handler');

// Send the action object at this.state.action to the action handler
module.exports = function *action_handle(next) {
  try {
    this.body = yield handler(this.state.action);
  }
  catch(err) {
    this.body = { message: err.message };
    this.status = 400;
  }
  yield next;
};
