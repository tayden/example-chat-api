// Uses values set by other middleware to set this.state.action to a valid
//   action object that can be interpreted by the action handler;
module.exports = function *action_create(next) {
  this.state.action = {
    type:       this.state.type,
    schema:     this.state.schema    || 'public',
    table:      this.state.table,
    where:      this.state.where     || {},
    filters:    this.state.filters   || [],
    sorts:      this.state.sorts     || [],
    fields:     this.state.fields    || [],
    offset:     this.query.offset    || 0,
    limit:      this.query.limit     || 20,
    data:       this.request.body    || {},
    returning:  this.state.returning || 'id',
    meta:       this.state.meta      || false,
    distinct:   this.state.distinct  || false
  };
  yield next;
};
