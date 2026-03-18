# mtg-vault
Personal MTG collection manager and deck builder

What was built (Stage 1 — Collection Viewer):
Step 1 — GitHub repo and project scaffold

Created private repo mtg-vault at github.com/machenry99/mtg-vault
Cloned to C:\AI\01_Projects\mtg-vault
Created folder structure: server/, client/, data/
Initialized npm, installed Express
Built server/index.js — Express server confirmed working on localhost:3001
First commit pushed to GitHub

Step 2 — Collection data

Exported collection from DelverLens as CSV with fields: Name, Condition, Foil, Language, Quantity, Scryfall ID, Edition
CSV saved to data/ and excluded from Git via .gitignore
Built server/buildCollection.js to parse CSV and generate collection.json
1,964 cards successfully parsed into data/collection.json

Step 3 — Scryfall API wrapper

Built server/scryfall.js — fetches card data from Scryfall by ID
Requires both User-Agent AND Accept headers (learned from 400 error)
Local cache saved to data/scryfall_cache.json (excluded from Git)
Cache prevents re-fetching cards already looked up

Step 4 — Collection API route

Built GET /api/collection with pagination (20 cards per page)
Returns Scryfall data merged with local collection data
Confirmed working at http://localhost:3001/api/collection

Step 5 — Frontend card grid

Built client/index.html — dark theme card grid
Displays card images, names, set names, prices, quantities
Pagination controls (99 pages for 1,964 cards)
Express configured to serve static files from client/

Step 6 — Search and add cards

Built GET /api/search — proxies Scryfall card search
Built POST /api/collection/add — adds card or increments quantity if already owned
Search UI added to frontend — search box, results grid, Add to Collection button
Full loop working: search → see results → add to collection → collection updates

Key lessons learned:

Always navigate to project directory before running commands (cd C:\AI\01_Projects\mtg-vault)
Scryfall requires both User-Agent and Accept headers or returns 400
Cache bad responses get saved — delete scryfall_cache.json if fixing an API issue
.gitignore should exclude data/*.csv and data/scryfall_cache.json
Git diff view in VS Code (orange M) just means unsaved changes — Ctrl+S to save

Workstation roadmap progress:

Stage 4A exit criterion satisfied — one complete AI-assisted coding project shipped
Stage 4B in progress — one more project needed

Next session — Stage 2 (Deck Builder):

Build deck CRUD routes (GET/POST/PUT /api/decks)
Decks save to data/decks/ as individual JSON files
Two-panel UI: collection on left, deck on right
Mana curve bar chart, colour identity pie chart
Format legality badges from Scryfall
Deck export as .txt or .json
