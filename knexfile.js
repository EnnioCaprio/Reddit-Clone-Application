require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DB_PROD,
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    },

  },

  testing: {
    client: 'pg',
    connection: process.env.DB_PROD,
    migrations: {
      directory: './data/migrations',
      schemaName: "public",
      tableName: "knex_migrations"
    },
    seeds: {
      directory: './data/seeds'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DB_PROD,
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/seeds'
    }
  }

};
