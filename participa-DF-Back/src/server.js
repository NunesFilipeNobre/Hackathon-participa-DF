import express from 'express';
import cors from 'cors';
import pg from 'pg'; // Importamos o pacote do Postgres
const { Pool } = pg;

// 1. CONFIGURAÇÃO DO APP
const app = express();
app.use(cors());
app.use(express.json());

// 2. CONEXÃO COM O BANCO DE DADOS
// (Colocamos direto aqui para não depender de arquivo db.js)
const pool = new Pool({
  user: process.env.DB_USER || 'app_user',
  host: process.env.DB_HOST || 'postgres', // Nome do container no Docker
  database: process.env.DB_NAME || 'participa_df',
  password: process.env.DB_PASSWORD || 'senha_forte',
  port: process.env.DB_PORT || 5432,
});

// 3. ROTA DE MANIFESTAÇÕES (A principal do seu Hackathon)
app.post('/manifestacoes', async (req, res) => {
  console.log("📝 Recebi nova manifestação!"); 

  const { protocolo, relato, assunto, localizacao, usuario, anonimo } = req.body;
  
  const lat = localizacao ? localizacao.lat : null;
  const lng = localizacao ? localizacao.lng : null;
  
  // Caminhos fictícios para arquivos
  const imagemPath = req.body.temArquivo ? `uploads/${protocolo}_foto.jpg` : null;
  const audioPath = req.body.temAudio ? `uploads/${protocolo}_audio.webm` : null;

  try {
    // Inicia conexão
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // Insere na tabela principal
        await client.query(`
          INSERT INTO MANIFESTACAO (PROTOCOLO, DESCRICAO, ASSUNTO, ANONIMO, LATITUDE, LONGITUDE, IMAGEM_PATH, AUDIO_PATH)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [protocolo, relato, assunto, anonimo, lat, lng, imagemPath, audioPath]);

        // Se tiver usuário e NÃO for anônimo, cria o vínculo
        if (usuario && !anonimo) {
            await client.query(`
              INSERT INTO USUARIO_MANIFESTACAO (CPF_USUARIO, PROTOCOLO_MANIFESTACAO)
              VALUES ($1, $2)
            `, [usuario.cpf, protocolo]);
        }

        await client.query('COMMIT');
        console.log("✅ Manifestação salva com sucesso: " + protocolo);
        res.status(201).json({ message: 'Sucesso!', protocolo });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Erro no SQL:", err);
        res.status(500).json({ error: "Erro ao salvar no banco." });
    } finally {
        client.release();
    }
  } catch (err) {
      console.error("❌ Erro de conexão com o banco:", err);
      res.status(500).json({ error: "Banco de dados indisponível." });
  }
});

// Rota de teste simples
app.get('/health', (req, res) => {
  res.json({ status: 'Backend Online 🚀' });
});

// INICIA O SERVIDOR
app.listen(3000, () => {
  console.log('🔥 API rodando em http://localhost:3000');
});