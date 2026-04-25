const fs = require('fs');
const path = require('path');
const os = require('os');
const { readCache, writeCache, clearCache, getCacheKey } = require('./cache');

const TEST_IMAGE = path.join(__dirname, '__fixtures__', 'test.png');
const MOCK_PALETTE = [
  { hex: '#ff5733', label: 'Vibrant Red', hsl: [9, 100, 60] },
  { hex: '#33c1ff', label: 'Sky Blue', hsl: [201, 100, 60] },
];

beforeAll(() => {
  const dir = path.join(__dirname, '__fixtures__');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(TEST_IMAGE)) {
    // write a minimal 1x1 PNG
    const minPng = Buffer.from(
      '89504e470d0a1a0a0000000d49484452000000010000000108020000009001' +
      '2e00000000c4944415478016360f8cfc00000000200016dd8a600000000049454e44ae426082',
      'hex'
    );
    fs.writeFileSync(TEST_IMAGE, minPng);
  }
});

afterEach(() => {
  clearCache();
});

describe('cache', () => {
  test('returns null for missing cache entry', () => {
    const result = readCache(TEST_IMAGE, 5);
    expect(result).toBeNull();
  });

  test('writes and reads back palette', () => {
    writeCache(TEST_IMAGE, 5, MOCK_PALETTE);
    const result = readCache(TEST_IMAGE, 5);
    expect(result).toEqual(MOCK_PALETTE);
  });

  test('cache key changes with different k values', () => {
    const key5 = getCacheKey(TEST_IMAGE, 5);
    const key8 = getCacheKey(TEST_IMAGE, 8);
    expect(key5).not.toBe(key8);
  });

  test('clearCache removes all entries and returns count', () => {
    writeCache(TEST_IMAGE, 5, MOCK_PALETTE);
    writeCache(TEST_IMAGE, 8, MOCK_PALETTE);
    const count = clearCache();
    expect(count).toBe(2);
    expect(readCache(TEST_IMAGE, 5)).toBeNull();
  });

  test('readCache returns null on corrupt data', () => {
    const cacheDir = path.join(os.homedir(), '.ember-palette', 'cache');
    const key = getCacheKey(TEST_IMAGE, 5);
    const cachePath = path.join(cacheDir, `${key}.json`);
    fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(cachePath, 'not valid json{{');
    const result = readCache(TEST_IMAGE, 5);
    expect(result).toBeNull();
  });
});
