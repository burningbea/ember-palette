const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const CACHE_DIR = path.join(process.env.HOME || process.env.USERPROFILE, '.ember-palette', 'cache');

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

function getCacheKey(filePath, k) {
  const hash = hashFile(filePath);
  return `${hash}-k${k}`;
}

function getCachePath(key) {
  return path.join(CACHE_DIR, `${key}.json`);
}

function readCache(filePath, k) {
  try {
    const key = getCacheKey(filePath, k);
    const cachePath = getCachePath(key);
    if (!fs.existsSync(cachePath)) return null;
    const raw = fs.readFileSync(cachePath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCache(filePath, k, palette) {
  try {
    ensureCacheDir();
    const key = getCacheKey(filePath, k);
    const cachePath = getCachePath(key);
    fs.writeFileSync(cachePath, JSON.stringify(palette, null, 2));
  } catch {
    // silently fail on cache write errors
  }
}

function clearCache() {
  if (!fs.existsSync(CACHE_DIR)) return 0;
  const files = fs.readdirSync(CACHE_DIR).filter(f => f.endsWith('.json'));
  files.forEach(f => fs.unlinkSync(path.join(CACHE_DIR, f)));
  return files.length;
}

module.exports = { readCache, writeCache, clearCache, getCacheKey };
