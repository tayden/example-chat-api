const db = require('./database');
const logger = require('./utils/logger');

module.exports = function(action) {
  logger.debug(action);

  let q;
  switch(action.type) {
  case 'GET_ALL':
    // Return metadata if querystring included '?meta'
    if (action.meta) {
      return db.select('column_name', 'data_type', 'udt_name', 'column_default', 'is_nullable', 'character_maximum_length')
        .from('information_schema.columns')
        .where('table_name', action.table)
        .andWhere('table_schema', action.schema)
        .then(res => {
          // Transform result to something that looks like knex.columnInfo()
          return res.reduce((o, c) => Object.assign(o, {
            [c.column_name]: {
              type: c.data_type,
              udt_name: c.udt_name,
              maxLength: c.character_maximum_length,
              nullable: c.is_nullable === 'YES',
              defaultValue: c.column_default
            }
          }), {});
        });
    }

    // Return data with querystring filters applied
    q = db.withSchema(action.schema)
      .select(action.fields)
      .where(action.where)
      .limit(action.limit)
      .offset(action.offset)
      .from(action.table);

    action.sorts.forEach(s => q.orderBy.apply(q, s));
    action.filters.forEach(a => {
      if(a[a.length-1] === ',') q.orWhere.apply(q, a);
      else q.andWhere.apply(q, a);
    });

    if(action.distinct) {
      q.distinct.apply(q, action.fields);
    }

    return q;

  case 'GET_ONE':
    q = db.withSchema(action.schema)
      .first(action.fields)
      .where(action.where)
      .limit(action.limit)
      .offset(action.offset)
      .from(action.table);

    action.sorts.forEach(s => q.orderBy.apply(q, s));
    action.filters.forEach(a => {
      if(a[a.length-1] === ',') q.orWhere.apply(q, a);
      else q.andWhere.apply(q, a);
    });

    return q;

  case 'POST':
    return db(action.table).withSchema(action.schema)
      .insert(action.data, action.returning)
      .map(id => db.first()
        .from(action.table).withSchema(action.schema)
        .where(action.returning, id)
      )
      .then(res => res[0]);

  case 'PUT':
    return db(action.table).withSchema(action.schema)
      .where(action.where)
      .update(action.data, action.returning)
      .map(id => db.first()
        .from(action.table).withSchema(action.schema)
        .where(action.returning, id)
      )
      .then(res => res[0]);

  case 'DELETE':
    return new Promise((resolve, reject) => {
      let temp;

      db(action.table).withSchema(action.schema)
        .where(action.where)
        .then(inst => { temp = Object.assign({}, inst[0]); return inst; })
        .then(() => db(action.table).withSchema(action.schema).where(action.where).del())
        .then(() => resolve(temp))
        .catch(reject);
    });
  }
};
