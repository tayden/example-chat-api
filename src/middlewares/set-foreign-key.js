// Add the foreign key and value to the data at this.request.body
module.exports = function *set_foreign_key(next) {
  Object.keys(this.params).forEach(key => {
    if( key !== '0') {
      this.request.body[key] = this.params[key];
    }
  });
  yield next;
};
