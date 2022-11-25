const { createPool } = require('mysql')

const db = createPool({
  host: 'localhost',
  user: 'root',
  password: 'Escale@123',
  database: 'smtps',
  connectionLimit: 10
})

module.exports = db
