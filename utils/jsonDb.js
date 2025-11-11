const fs = require('fs').promises;
const path = require('path');

// Default DB path (can be overridden with JSON_DB_PATH env var)
const DB_PATH = process.env.JSON_DB_PATH || path.join(__dirname, '..', 'data', 'inventory.json');

// Ensure directory exists
async function ensureDir() {
  const dir = path.dirname(DB_PATH);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    // ignore
  }
}

// Serialize writes with a simple promise chain to avoid concurrent writes
let writeLock = Promise.resolve();

async function loadDB() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    // ensure shape
    return {
      inventory: Array.isArray(parsed.inventory) ? parsed.inventory : [],
      promos: Array.isArray(parsed.promos) ? parsed.promos : []
    };
  } catch (err) {
    return { inventory: [], promos: [] };
  }
}

async function saveDB(dbObj) {
  await ensureDir();
  const tmp = DB_PATH + '.tmp';
  // Serialize writes
  writeLock = writeLock.then(() => fs.writeFile(tmp, JSON.stringify(dbObj, null, 2), { mode: 0o600 }))
    .then(() => fs.rename(tmp, DB_PATH))
    .catch(err => {
      console.error('Error writing DB file:', err);
      throw err;
    });
  return writeLock;
}

async function upsertInventoryItem(item) {
  const db = await loadDB();
  const inventory = db.inventory || [];

  if (Array.isArray(item)) {
    item.forEach(it => {
      const idx = inventory.findIndex(i => i.id === it.id);
      if (idx === -1) inventory.push(it);
      else inventory[idx] = Object.assign({}, inventory[idx], it);
    });
  } else {
    const idx = inventory.findIndex(i => i.id === item.id);
    if (idx === -1) {
      inventory.push(item);
    } else {
      inventory[idx] = Object.assign({}, inventory[idx], item);
    }
  }

  db.inventory = inventory;
  await saveDB(db);
  return db.inventory;
}

async function loadInventory() {
  const db = await loadDB();
  return db.inventory || [];
}

async function loadPromos() {
  const db = await loadDB();
  return db.promos || [];
}

async function upsertPromo(promo) {
  const db = await loadDB();
  const promos = db.promos || [];

  const idx = promos.findIndex(p => p.id === promo.id);
  if (idx === -1) {
    promos.push(promo);
  } else {
    promos[idx] = Object.assign({}, promos[idx], promo);
  }

  db.promos = promos;
  await saveDB(db);
  return db.promos;
}

async function deletePromo(promoId) {
  const db = await loadDB();
  db.promos = (db.promos || []).filter(p => p.id !== promoId);
  await saveDB(db);
  return db.promos;
}

module.exports = {
  loadDB,
  saveDB,
  upsertInventoryItem,
  upsertPromo,
  deletePromo,
  DB_PATH
};
