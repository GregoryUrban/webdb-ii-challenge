
exports.up = function(knex, Promise) {
    return knex.schema.createTable('roles', function(tbl) {
        //primary key called id, integer, autoincrement
        tbl.increments();
    
        tbl
        .string('name', 128)
        .notNullable()
        .unique();
        tbl.timestamps(true,true);
        });  
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('roles');

};
