// scripts/create_staff_table.js
// Usage:
// 1) Install dependency: npm install mysql2
// 2) Set DATABASE_URL in PowerShell:
//    $env:DATABASE_URL = "mysql://user:password@host:3306/database"
// 3) Run: node scripts/create_staff_table.js

const mysql = require('mysql2/promise')
const { URL } = require('url')

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable not set')
  process.exit(1)
}

function parseDatabaseUrl(url) {
  const u = new URL(url)
  return {
    host: u.hostname,
    port: u.port || 3306,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, '')
  }
}

const SQL = `
CREATE TABLE IF NOT EXISTS staff (
  staffID INT AUTO_INCREMENT PRIMARY KEY,
  clientID INT NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
  viewDashboard TINYINT(1) DEFAULT 0,
  viewOrders TINYINT(1) DEFAULT 0,
  viewClients TINYINT(1) DEFAULT 0,
  viewAffiliates TINYINT(1) DEFAULT 0,
  addProducts TINYINT(1) DEFAULT 0,
  changeContent TINYINT(1) DEFAULT 0,
  addOffers TINYINT(1) DEFAULT 0,
  INDEX idx_staff_clientID (clientID),
  CONSTRAINT fk_staff_client FOREIGN KEY (clientID) REFERENCES client(clientID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`

;(async () => {
  try {
    const cfg = parseDatabaseUrl(DATABASE_URL)
    console.log('Connecting to', cfg.host, 'db', cfg.database)
    const conn = await mysql.createConnection({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.database,
      multipleStatements: true
    })

    console.log('Creating staff table (if not exists)...')
    await conn.query(SQL)
    console.log('Done.');
    await conn.end()
  } catch (err) {
    console.error('Error:', err.message || err)
    process.exit(1)
  }
})()
