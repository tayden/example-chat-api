// Set this.state.schema and this.state.table to the tablename used for the db query
module.exports = function set_model(model) {
  return function *(next) {
    const temp = model.split('.');
    if (temp.length >= 1) {
      [this.state['schema'], this.state['table']] = temp;
    } else {
      this.state['table'] = model;
    }

    yield next;
  };
};
