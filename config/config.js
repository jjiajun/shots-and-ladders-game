require('dotenv').config()
module.exports = {
  development: {
    username: process.env.PG_USER, //for postgres this is often the same as the UNIX username
    password: null, //for postgres null
    // Use "_development" suffix to indicate DB is for development purposes
    database: process.env.PG_DB_NAME,
    host: process.env.PG_HOST,
    dialect: process.env.DB_DIALECT,
  },
};