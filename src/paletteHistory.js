/**
 * paletteHistory.js
 * Tracks and manages previously extracted palettes,
 * allowing users to compare or revisit past results.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HISTORY_DIR = path.join(os.homedir(), '.ember-palette');
const HISTORY_FILE = path.join(HISTORY_DIR, 'history.json');
const MAX_HISTORY_ENTRIES = 50;

/**
 * Ensures the history file exists, creating it if necessary.
 * @returns {void}
 */
function ensureHistoryFile() {
  if (!fs.existsSync(HISTORY_DIR)) {
    fs.mkdirSync(HISTORY_DIR, { recursive: true });
  }
  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([]), 'utf-8');
  }
}

/**
 * Reads all history entries from disk.
 * @returns {Array<Object>} Array of history entry objects
 */
function readHistory() {
  ensureHistoryFile();
  try {
    const raw = fs.readFileSync(HISTORY_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Writes history entries to disk.
 * @param {Array<Object>} entries
 * @returns {void}
 */
function writeHistory(entries) {
  ensureHistoryFile();
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(entries, null, 2), 'utf-8');
}

/**
 * Adds a new palette result to history.
 * Trims oldest entries if MAX_HISTORY_ENTRIES is exceeded.
 * @param {string} imagePath - The source image path
 * @param {Array<string>} colors - Array of hex color strings
 * @param {Object} [meta={}] - Optional metadata (k, filters applied, etc.)
 * @returns {Object} The saved history entry
 */
function addToHistory(imagePath, colors, meta = {}) {
  const entries = readHistory();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),
    imagePath: path.resolve(imagePath),
    colors,
    meta,
  };
  entries.unshift(entry);
  if (entries.length > MAX_HISTORY_ENTRIES) {
    entries.splice(MAX_HISTORY_ENTRIES);
  }
  writeHistory(entries);
  return entry;
}

/**
 * Retrieves a history entry by its ID.
 * @param {string} id
 * @returns {Object|null}
 */
function getHistoryEntry(id) {
  const entries = readHistory();
  return entries.find((e) => e.id === id) || null;
}

/**
 * Clears all history entries.
 * @returns {void}
 */
function clearHistory() {
  writeHistory([]);
}

/**
 * Returns the N most recent history entries.
 * @param {number} [n=10]
 * @returns {Array<Object>}
 */
function getRecentHistory(n = 10) {
  const entries = readHistory();
  return entries.slice(0, n);
}

module.exports = {
  ensureHistoryFile,
  readHistory,
  addToHistory,
  getHistoryEntry,
  clearHistory,
  getRecentHistory,
};
