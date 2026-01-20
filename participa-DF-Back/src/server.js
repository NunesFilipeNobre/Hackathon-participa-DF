import cors from 'cors';
import express from 'express';
import { pool } from './db.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/usuarios', async (req, res) => {
  const result = await pool.query('SELECT * FROM usuarios');
  res.json(result.rows);
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('API rodando em http://localhost:3000');
});