exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(users) {
    //primary key
    users.increments("user_id");
    //username
    users
      .string("name", 128)
      .notNullable()
      .unique();
    //password
    users.string("password", 128).notNullable();
    table.timestampe("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
