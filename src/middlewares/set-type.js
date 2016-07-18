// Uses values set by other middleware to set this.state.action to a valid
//   action object that can be interpreted by the action handler;
module.exports = function set_type(type) {
  return function *(next) {
    this.state.type = type;
    yield next;
  };
};
