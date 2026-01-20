import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'sua_senha',
  database: 'meubanco',
  port: 5432,
});