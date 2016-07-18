
exports.up = function(knex) {
  return knex.schema.createTable('message', table => {
    table.increments('pk').primary().index();
    table.string('username').notNullable();
    table.text('message').notNullable();
    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('message');
};
