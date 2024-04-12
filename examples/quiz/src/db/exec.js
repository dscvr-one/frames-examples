import fs from 'fs';
import pg from 'pg';

const args = process.argv.slice(2);
const connectionString = args[0];
const file = args[1];
if (!connectionString || !file) {
  console.error('Usage: node exec.js <connectionString> <file>');
  process.exit(1);
}
const pool = new pg.Pool({ connectionString });

const printCommand = (result) => {
  if (result?.command === 'SELECT' && result?.rows) {
    console.log('SELECT: ');
    console.log(result.rows);
  } else {
    console.log('MUTATION: ');
    console.log(result);
  }
};

try {
  const sqlFile = fs.readFileSync(file, 'utf8');
  const results = await pool.query(sqlFile);
  console.log('Response: ');
  if (Array.isArray(results)) {
    results.forEach(printCommand);
  } else {
    printCommand(results);
  }
} catch (err) {
  console.error(err);
} finally {
  await pool.end();
  process.exit(0);
}
