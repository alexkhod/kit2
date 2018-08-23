exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema
      .createTable('zver', table => {
        table.increments();
        table.string('inv');
        table.boolean('isWork');
        table.timestamps(false, true);
      })
      .createTable('block', table => {
        table.increments();
        table
          .integer('zver_id')
          .unsigned()
          .references('id')
          .inTable('zver')
          .onDelete('CASCADE');
        table.string('inv');
        table.boolean('isWork');
        table.timestamps(false, true);
      })
      .createTable('module', table => {
        table.increments();
        table
          .integer('block_id')
          .unsigned()
          .references('id')
          .inTable('block')
          .onDelete('CASCADE');
        table.string('inv');
        table.boolean('isWork');
        table.timestamps(false, true);
      })
      .createTable('note', table => {
        table.increments();
        table
          .integer('zver_id')
          .unsigned()
          .references('id')
          .inTable('zver')
          .onDelete('CASCADE');
        table
          .integer('block_id')
          .unsigned()
          .references('id')
          .inTable('block')
          .onDelete('CASCADE');
        table
          .integer('module_id')
          .unsigned()
          .references('id')
          .inTable('module')
          .onDelete('CASCADE');
        table.string('content');
        table.string('user_id');
        table.timestamps(false, true);
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('zver'),
    knex.schema.dropTable('block'),
    knex.schema.dropTable('module'),
    knex.schema.dropTable('note')
  ]);
};
