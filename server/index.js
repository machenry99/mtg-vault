const express = require('express');
const fs = require('fs');
const path = require('path');
const { fetchCard } = require('./scryfall');

const app = express();
const PORT = 3001;

app.use(express.json());app.use(express.static(path.join(__dirname, '../client')));

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
          return { ...scryfallData, quantity: entry.quantity, edition: entry.edition, condition: entry.condition, foil: entry.foil, language: entry.language };
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
// Search route - proxies Scryfall card search
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ cards: [] });

  const https = require('https');
  const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&unique=prints`;

  https.get(url, { headers: { 'User-Agent': 'MTGVault/1.0', 'Accept': 'application/json' } }, (response) => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (json.object === 'error') return res.json({ cards: [] });
        const cards = json.data.map(card => ({
          id: card.id,
          name: card.name,
          set: card.set_name,
          image: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || null,
          price: card.prices?.usd || card.prices?.usd_foil || '0.00',
          rarity: card.rarity,
          type: card.type_line
        }));
        res.json({ cards });
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    });
  }).on('error', (e) => res.status(500).json({ error: e.message }));
});

// Add card to collection
app.post('/api/collection/add', (req, res) => {
  try {
    const { scryfallId, name, quantity = 1, edition = '', condition = '', foil = '', language = '' } = req.body;
    if (!scryfallId) return res.status(400).json({ error: 'scryfallId required' });

    const filePath = path.join(__dirname, '../data/collection.json');
    const collection = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const existing = collection.find(c => c.scryfallId === scryfallId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      collection.push({ name, condition, foil, language, quantity, scryfallId, edition });
    }

    fs.writeFileSync(filePath, JSON.stringify(collection, null, 2));
    res.json({ success: true, total: collection.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
app.listen(PORT, () => {
  console.log(`MTG Vault running on http://localhost:${PORT}`);
});