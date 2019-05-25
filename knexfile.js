// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/bears.sqlite3'
    },
    useNullAsDefault: true,
    debug: true 
  }
};
