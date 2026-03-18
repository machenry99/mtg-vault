const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('MTG Vault alive.');
});

app.listen(PORT, () => {
  console.log(`MTG Vault running on http://localhost:${PORT}`);
});