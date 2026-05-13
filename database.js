const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'app.db');
const db = new sqlite3.Database(dbPath);

const initializeDatabase = () => {
  db.serialize(() => {
    // Users Table (for PIN authentication)
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        pin TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Pages Table
    db.run(`
      CREATE TABLE IF NOT EXISTS pages (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        rate REAL NOT NULL,
        is_closed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Data Rows Table
    db.run(`
      CREATE TABLE IF NOT EXISTS data_rows (
        id TEXT PRIMARY KEY,
        page_id TEXT NOT NULL,
        serial_number INTEGER NOT NULL,
        remark TEXT,
        bd_number TEXT,
        dirham REAL,
        bdt REAL,
        uae_number TEXT,
        is_verified INTEGER DEFAULT 0,
        color TEXT DEFAULT 'normal',
        entry_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(page_id) REFERENCES pages(id)
      )
    `);

    // Verification History
    db.run(`
      CREATE TABLE IF NOT EXISTS verification_history (
        id TEXT PRIMARY KEY,
        data_row_id TEXT NOT NULL,
        verified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(data_row_id) REFERENCES data_rows(id)
      )
    `);

    console.log('Database initialized successfully');
  });
};

const run = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const get = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = {
  db,
  initializeDatabase,
  run,
  get,
  all
};
