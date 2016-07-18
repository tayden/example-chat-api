// Add all querystrings to the request state
module.exports = function *parse_querystring(next) {
  // Parse filters
  let filters = decodeURI(this.querystring)
    .match(/([&,]?\w+[=><]+[\w-\s\.]+)/g) || [];

  this.state['filters'] = filters
    .map(q => q.split(/(<=|>=|<|>|=)/))
    .filter(q => q.length === 3)
    .map(q => {
      if(q[0].startsWith(',') || q[0].startsWith('&')) {
        q.push(q[0][0]);
        q[0] = q[0].slice(1);
      }
      return q;
    })
    .filter(q => ['sort', 'fields', 'offset', 'limit'].indexOf(q[0]) < 0);

  // Parse sort
  let sorts = this.query.sort;
  if (sorts) {
    sorts = sorts
      .split(',')
      .map(s => {
        if (s[0] == '-') return [s.slice(1), 'desc'];
        else if (s[0] == '+') return [s.slice(1), 'asc'];
        else return [s, 'asc'];
      });
  }
  this.state['sorts'] = sorts || null;

  // Parse fields
  this.state['fields'] = this.query.fields
    && this.query.fields.split(',')
    || null;

  // Parse meta flag
  this.state.meta = 'meta' in this.query;

  // Parse distinct flag
  this.state.distinct = 'distinct' in this.query;

  yield next;
};
