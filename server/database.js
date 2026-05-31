const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./restaurant.db')

db.serialize(() => {

  db.run(`
    CREATE TABLE IF NOT EXISTS waiters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS calls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_number TEXT,
      status TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      accepted_at DATETIME,
      completed_at DATETIME
    )
  `)

})

module.exports = db