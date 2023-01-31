const { Pool } = require("pg");

const db = new Pool({
  user: "kira",
  password: "kira",
  database: "finances",
  host: "localhost",
  port: 5432,
});

module.exports = db;
