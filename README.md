# mtg-vault
Personal MTG collection manager and deck builder

# MTG Vault

A locally-hosted Magic: The Gathering collection manager built with Node.js and Express.

## Features
- Browse your full card collection with Scryfall card images and live prices
- Paginated card grid (20 cards per page)
- Search any card on Scryfall and add it to your collection (currently here)
- Collection stored as a simple JSON file you own and control

## Tech Stack
- Node.js + Express (backend)
- Vanilla JS + HTML/CSS (frontend)
- Scryfall REST API (card data, images, prices)
- JSON flat files (storage)

## Setup

1. Clone the repo
   git clone https://github.com/machenry99/mtg-vault.git
   cd mtg-vault

2. Install dependencies
   npm install

3. Add your collection
   - Export your collection from DelverLens as a CSV with these fields:
     Name, Condition, Foil, Language, Quantity, Scryfall ID, Edition
   - Save it to data/ and update the filename in server/buildCollection.js
   - Run: node server/buildCollection.js

4. Start the server
   node server/index.js

5. Open your browser
   http://localhost:3001

## Project Status
- Stage 1 (Collection Viewer) — Complete
- Stage 2 (Deck Builder) — Coming soon
- Stage 3 (Price Dashboard) — Planned
- Stage 4 (AI Deck Assistant) — Planned
