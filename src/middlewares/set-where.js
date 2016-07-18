// Sets the key lookup object on state using param name
// Used by create action
module.exports = function *set_where(next) {
  this.state['where'] = {};
  Object.keys(this.params).forEach(key => {
    if( key !== '0')
      this.state.where[key] = this.params[key];
  });
  yield next;
};
