const fs = require('fs');
const path = require('path');

// Read the CSV
const csvPath = path.join(__dirname, '../data/cards_2026_Mar_18_11-13.csv');
const outputPath = path.join(__dirname, '../data/collection.json');

const lines = fs.readFileSync(csvPath, 'utf8').split('\n');

// Skip header row, parse each line
const cards = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  // Parse CSV row (handles quoted fields)
  const cols = line.match(/(".*?"|[^,]+)(?=,|$)/g);
  if (!cols || cols.length < 7) continue;

  const clean = cols.map(c => c.replace(/^"|"$/g, '').trim());

  const name = clean[0];
  const condition = clean[2] || '';
  const foil = clean[3] || '';
  const language = clean[4] || '';
  const quantity = parseInt(clean[5]) || 1;
  const scryfallId = clean[6];

  if (!scryfallId) continue;

  cards.push({ name, condition, foil, language, quantity, scryfallId });
}

console.log(`Parsed ${cards.length} cards from CSV`);
fs.writeFileSync(outputPath, JSON.stringify(cards, null, 2));
console.log(`Wrote collection.json to ${outputPath}`);
