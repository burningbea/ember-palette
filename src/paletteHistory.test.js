import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  ensureHistoryFile,
  readHistory,
  writeHistory,
  addToHistory,
  getHistoryEntry,
  listHistory,
  clearHistory,
} from './paletteHistory.js';

const MOCK_HISTORY_PATH = '/tmp/test-palette-history.json';

vi.mock('fs');

const mockEntry = {
  file: 'sunset.png',
  hash: 'abc123',
  timestamp: '2024-01-15T10:00:00.000Z',
  palette: [
    { hex: '#FF6B35', label: 'Vibrant', hsl: [18, 100, 60] },
    { hex: '#2C3E50', label: 'Dark', hsl: [210, 29, 24] },
  ],
};

const mockHistory = {
  entries: [mockEntry],
};

describe('ensureHistoryFile', () => {
  it('creates history file if it does not exist', () => {
    fs.existsSync = vi.fn().mockReturnValue(false);
    fs.writeFileSync = vi.fn();

    ensureHistoryFile(MOCK_HISTORY_PATH);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      MOCK_HISTORY_PATH,
      JSON.stringify({ entries: [] }, null, 2)
    );
  });

  it('does not overwrite existing history file', () => {
    fs.existsSync = vi.fn().mockReturnValue(true);
    fs.writeFileSync = vi.fn();

    ensureHistoryFile(MOCK_HISTORY_PATH);

    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});

describe('readHistory', () => {
  it('returns parsed history from file', () => {
    fs.existsSync = vi.fn().mockReturnValue(true);
    fs.readFileSync = vi.fn().mockReturnValue(JSON.stringify(mockHistory));

    const result = readHistory(MOCK_HISTORY_PATH);
    expect(result.entries).toHaveLength(1);
    expect(result.entries[0].hash).toBe('abc123');
  });

  it('returns empty history if file is missing', () => {
    fs.existsSync = vi.fn().mockReturnValue(false);

    const result = readHistory(MOCK_HISTORY_PATH);
    expect(result.entries).toEqual([]);
  });
});

describe('writeHistory', () => {
  it('writes history object to file as JSON', () => {
    fs.writeFileSync = vi.fn();

    writeHistory(MOCK_HISTORY_PATH, mockHistory);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      MOCK_HISTORY_PATH,
      JSON.stringify(mockHistory, null, 2)
    );
  });
});

describe('addToHistory', () => {
  it('prepends a new entry to history', () => {
    fs.existsSync = vi.fn().mockReturnValue(true);
    fs.readFileSync = vi.fn().mockReturnValue(JSON.stringify({ entries: [] }));
    fs.writeFileSync = vi.fn();

    addToHistory(MOCK_HISTORY_PATH, mockEntry);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written.entries[0].hash).toBe('abc123');
  });

  it('replaces existing entry with same hash', () => {
    fs.existsSync = vi.fn().mockReturnValue(true);
    fs.readFileSync = vi.fn().mockReturnValue(JSON.stringify(mockHistory));
    fs.writeFileSync = vi.fn();

    const updated = { ...mockEntry, timestamp: '2024-02-01T00:00:00.000Z' };
    addToHistory(MOCK_HISTORY_PATH, updated);

    const written = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(written.entries).toHaveLength(1);
    expect(written.entries[0].timestamp).toBe('2024-02-01T00:00:00.000Z');
  });
});

describe('getHistoryEntry', () => {
  it('returns entry matching the given hash', () => {
    fs.existsSync = vi.fn().mockReturnValue(true);
    fs.readFileSync = vi.fn().mockReturnValue(JSON.stringify(mockHistory));

    const result = getHistoryEntry(MOCK_HISTORY_PATH, 'abc123');
    expect(result).not.toBeNull();
    expect(result.file).toBe('sunset.png');
  });

  it('returns null if hash not found', () => {
    fs.existsSync = vi.fn().mockReturnValue(true);
    fs.readFileSync = vi.fn().mockReturnValue(JSON.stringify(mockHistory));

    const result = getHistoryEntry(MOCK_HISTORY_PATH, 'notfound');
    expect(result).toBeNull();
  });
});

describe('listHistory', () => {
  it('returns all entries sorted by timestamp descending', () => {
    const twoEntries = {
      entries: [
        { ...mockEntry, timestamp: '2024-01-10T00:00:00.000Z', hash: 'older' },
        { ...mockEntry, timestamp: '2024-01-15T00:00:00.000Z', hash: 'newer' },
      ],
    };
    fs.existsSync = vi.fn().mockReturnValue(true);
    fs.readFileSync = vi.fn().mockReturnValue(JSON.stringify(twoEntries));

    const result = listHistory(MOCK_HISTORY_PATH);
    expect(result[0].hash).toBe('newer');
    expect(result[1].hash).toBe('older');
  });
});

describe('clearHistory', () => {
  it('resets history to empty entries array', () => {
    fs.writeFileSync = vi.fn();

    clearHistory(MOCK_HISTORY_PATH);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      MOCK_HISTORY_PATH,
      JSON.stringify({ entries: [] }, null, 2)
    );
  });
});
