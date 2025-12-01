// scripts/add_transaction_columns.js
// Adds `quantity` and `logo` columns to the `transaction` table if they don't exist.
// Usage:
// npm install mysql2
// $env:DATABASE_URL = "mysql://user:pass@host:port/database"
// node scripts/add_transaction_columns.js

const mysql = require('mysql2/promise');

function parseDatabaseUrl(databaseUrl) {
  // mysql://user:pass@host:port/dbname
  const matched = databaseUrl.match(/mysql:\/\/(.*?):(.*?)@(.*?):(\d+)\/(.*)/);
  if (!matched) throw new Error('Invalid DATABASE_URL format');
  return {
    user: matched[1],
    password: matched[2],
    host: matched[3],
    port: parseInt(matched[4], 10),
    database: matched[5]
  };
}

(async () => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error('DATABASE_URL environment variable missing');
    const cfg = parseDatabaseUrl(dbUrl);

    const conn = await mysql.createConnection({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.database,
      multipleStatements: true
    });

    // Add columns if not exists (MySQL 8+ supports IF NOT EXISTS in ALTER TABLE...ADD COLUMN)
    const sql = `
      ALTER TABLE ` + '\`transaction\`' + `
        ADD COLUMN IF NOT EXISTS quantity INT DEFAULT 1,
        ADD COLUMN IF NOT EXISTS logo VARCHAR(255) DEFAULT '';
    `;

    console.log('Executing SQL to add columns...');
    const [result] = await conn.query(sql);
    console.log('Result:', result);

    await conn.end();
    console.log('Done.');
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();
