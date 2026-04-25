const fs = require('fs');
const path = require('path');
const os = require('os');
const { themeToJSON, themeToSCSS, exportTheme } = require('./themeExporter');

const sampleTheme = {
  background: '#f5f5f5',
  text: '#1a1a2e',
  primary: '#0f3460',
  secondary: '#16213e',
  accent: '#e94560'
};

let tmpDir;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ember-palette-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('themeToJSON', () => {
  test('produces valid JSON', () => {
    const json = themeToJSON(sampleTheme);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  test('contains all theme keys', () => {
    const parsed = JSON.parse(themeToJSON(sampleTheme));
    expect(parsed).toMatchObject(sampleTheme);
  });
});

describe('themeToSCSS', () => {
  test('generates SCSS variable lines', () => {
    const scss = themeToSCSS(sampleTheme);
    expect(scss).toContain('$color-background: #f5f5f5;');
    expect(scss).toContain('$color-accent: #e94560;');
  });

  test('has one variable per theme role', () => {
    const lines = themeToSCSS(sampleTheme).split('\n').filter(Boolean);
    expect(lines).toHaveLength(Object.keys(sampleTheme).length);
  });
});

describe('exportTheme', () => {
  test('writes CSS file', () => {
    const out = path.join(tmpDir, 'theme.css');
    exportTheme(sampleTheme, out, 'css');
    const content = fs.readFileSync(out, 'utf8');
    expect(content).toContain(':root {');
  });

  test('writes JSON file', () => {
    const out = path.join(tmpDir, 'theme.json');
    exportTheme(sampleTheme, out, 'json');
    const parsed = JSON.parse(fs.readFileSync(out, 'utf8'));
    expect(parsed.accent).toBe('#e94560');
  });

  test('writes SCSS file', () => {
    const out = path.join(tmpDir, 'theme.scss');
    exportTheme(sampleTheme, out, 'scss');
    const content = fs.readFileSync(out, 'utf8');
    expect(content).toContain('$color-primary');
  });

  test('creates nested directories if needed', () => {
    const out = path.join(tmpDir, 'nested', 'deep', 'theme.css');
    exportTheme(sampleTheme, out, 'css');
    expect(fs.existsSync(out)).toBe(true);
  });

  test('defaults to CSS format', () => {
    const out = path.join(tmpDir, 'theme-default.css');
    exportTheme(sampleTheme, out);
    const content = fs.readFileSync(out, 'utf8');
    expect(content).toContain('--color-text');
  });
});
