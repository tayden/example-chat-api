// Set this.state.returning to the correct pk attr to allow post and put to return correctly
module.exports = function set_returning(pk='id') {
  return function *(next) {
    this.state['returning'] = pk;
    yield next;
  };
};
