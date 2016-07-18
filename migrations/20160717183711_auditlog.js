
exports.up = function(knex) {
  return knex.schema.createTable('auditlog', table => {
    table.increments('pk').primary();
    table.jsonb('action');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('auditlog');
};
