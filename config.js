'use strict';

const DATABASE_URL = process.env.DATABASE_URL;

exports.DATABASE = {
  client: 'pg',
  connection: DATABASE_URL,
  pool: { min: 0, max: 1 }, // Fix issue w/ ElephantSQL
  debug: true               // Outputs knex debugging information
};

exports.PORT = process.env.PORT || 8080; 

console.log(DATABASE_URL);