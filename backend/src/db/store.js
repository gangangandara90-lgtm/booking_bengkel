import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "../../data/db.json");

function readDb() {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify({ admins: [], pelanggan: [], mekanik: [], layanan: [], booking: [], servis: [], mogok: [], pembayaran: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function getAll(collection) {
  return readDb()[collection] || [];
}

export function findById(collection, id) {
  return getAll(collection).find((item) => item.id === id);
}

export function insert(collection, item) {
  const db = readDb();
  db[collection] = [item, ...(db[collection] || [])];
  writeDb(db);
  return item;
}

export function update(collection, id, patch) {
  const db = readDb();
  db[collection] = (db[collection] || []).map((item) => item.id === id ? { ...item, ...patch } : item);
  writeDb(db);
  return db[collection].find((item) => item.id === id);
}

export function remove(collection, id) {
  const db = readDb();
  db[collection] = (db[collection] || []).filter((item) => item.id !== id);
  writeDb(db);
}

export function makeId(prefix) {
  const date = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  const random = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${date}-${random}`;
}
