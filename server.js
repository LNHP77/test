const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

const pool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.post('/contact', async (req, res) => {
  const { name, _replyto, message } = req.body;
  console.log("Reçu :", req.body);

  try {
    await pool.query(
      'INSERT INTO messages (nom, email, message) VALUES ($1, $2, $3)',
      [name, _replyto, message]
    );
    res.send('<p style="color:green;">Message enregistré dans PostgreSQL !</p><a href="/">Retour</a>');
  } catch (err) {
    console.error("Erreur BDD :", err);
    res.status(500).send("Erreur lors de l'enregistrement.");
  }
});

app.listen(port, () => {
  console.log(`Serveur actif sur http://localhost:${port}`);
});
