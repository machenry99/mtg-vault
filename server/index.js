const express = require('express');
const fs = require('fs');
const path = require('path');
const { fetchCard } = require('./scryfall');

const app = express();
const PORT = 3001;

app.use(express.json());

// Load collection from JSON
function getCollection() {
  const filePath = path.join(__dirname, '../data/collection.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

app.get('/', (req, res) => {
  res.send('MTG Vault alive.');
});

// Collection route - returns first 20 cards with Scryfall data
app.get('/api/collection', async (req, res) => {
  try {
    const collection = getCollection();
    const page = parseInt(req.query.page) || 0;
    const pageSize = 20;
    const slice = collection.slice(page * pageSize, (page + 1) * pageSize);

    const cards = await Promise.all(
      slice.map(async (entry) => {
        try {
          const scryfallData = await fetchCard(entry.scryfallId);
          return { ...scryfallData, quantity: entry.quantity };
        } catch (e) {
          return { ...entry, image: null, price: '0.00' };
        }
      })
    );

    res.json({ total: collection.length, page, cards });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`MTG Vault running on http://localhost:${PORT}`);
});