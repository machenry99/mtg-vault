const https = require('https');
const fs = require('fs');
const path = require('path');

const CACHE_PATH = path.join(__dirname, '../data/scryfall_cache.json');

// Load cache from disk if it exists
let cache = {};
if (fs.existsSync(CACHE_PATH)) {
  cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
}

// Save cache to disk
function saveCache() {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
}

// Fetch a single card from Scryfall by ID
function fetchCard(scryfallId) {
  return new Promise((resolve, reject) => {
    // Return cached result if we have it
    if (cache[scryfallId]) {
      resolve(cache[scryfallId]);
      return;
    }

    const url = `https://api.scryfall.com/cards/${scryfallId}`;
    https.get(url, { headers: { 'User-Agent': 'MTGVault/1.0', 'Accept': 'application/json' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const card = JSON.parse(data);
          const result = {
            id: card.id,
            name: card.name,
            set: card.set_name,
            image: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal || null,
            price: card.prices?.usd || card.prices?.usd_foil || '0.00',
            rarity: card.rarity,
            type: card.type_line
          };
          cache[scryfallId] = result;
          saveCache();
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

module.exports = { fetchCard };