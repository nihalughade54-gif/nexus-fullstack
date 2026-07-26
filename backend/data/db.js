import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, 'db');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR);

function filePath(name) {
  return path.join(DB_DIR, `${name}.json`);
}

export function readTable(name) {
  const file = filePath(name);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

export function writeTable(name, data) {
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2));
}
