require("dotenv").config({
  path: [".env.development.local", ".env"],
});

let { PG_HOST, PG_DATABASE, PG_USER, PG_PASSWORD, ENDPOINT_ID } = process.env;

var config = {
  development: {
    dialect: "sqlite",
    storage: "./db/development.sqlite",
  },
  production: {
    username: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    host: PG_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: true },
    },
    connection: {
      options: `project=${ENDPOINT_ID}`,
    },
  },
};

module.exports = config;
