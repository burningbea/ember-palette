import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { paletteToJSON, paletteToCSS, paletteToSCSS, exportPalette } from './paletteExporter.js';
import fs from 'fs';

vi.mock('fs');

const mockPalette = [
  { hex: '#ff5733', label: 'Warm Red', vibrant: true },
  { hex: '#33c1ff', label: 'Sky Blue', vibrant: false },
  { hex: '#2ecc71', label: 'Emerald', vibrant: true },
];

describe('paletteToJSON', () => {
  it('serializes palette colors', () => {
    const result = JSON.parse(paletteToJSON(mockPalette));
    expect(result.colors).toHaveLength(3);
    expect(result.colors[0].hex).toBe('#ff5733');
  });

  it('includes theme when provided', () => {
    const theme = { accent: '#ff5733', background: '#ffffff' };
    const result = JSON.parse(paletteToJSON(mockPalette, theme));
    expect(result.theme).toEqual(theme);
  });

  it('omits theme key when not provided', () => {
    const result = JSON.parse(paletteToJSON(mockPalette));
    expect(result.theme).toBeUndefined();
  });
});

describe('paletteToCSS', () => {
  it('wraps output in :root block', () => {
    const css = paletteToCSS(mockPalette);
    expect(css).toMatch(/^:root \{/);
    expect(css).toMatch(/\}$/);
  });

  it('generates kebab-case variable names from labels', () => {
    const css = paletteToCSS(mockPalette);
    expect(css).toContain('--color-warm-red: #ff5733');
    expect(css).toContain('--color-sky-blue: #33c1ff');
  });

  it('falls back to index-based names when label is missing', () => {
    const unlabeled = [{ hex: '#aabbcc' }];
    const css = paletteToCSS(unlabeled);
    expect(css).toContain('--color-1: #aabbcc');
  });
});

describe('paletteToSCSS', () => {
  it('produces SCSS variable declarations', () => {
    const scss = paletteToSCSS(mockPalette);
    expect(scss).toContain('$color-warm-red: #ff5733;');
    expect(scss).toContain('$color-emerald: #2ecc71;');
  });

  it('falls back to index names without labels', () => {
    const scss = paletteToSCSS([{ hex: '#123456' }]);
    expect(scss).toContain('$color-1: #123456;');
  });
});

describe('exportPalette', () => {
  beforeEach(() => {
    fs.existsSync = vi.fn().mockReturnValue(true);
    fs.mkdirSync = vi.fn();
    fs.writeFileSync = vi.fn();
  });

  it('writes JSON content to disk', () => {
    exportPalette(mockPalette, 'json', '/out/palette.json');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '/out/palette.json',
      expect.stringContaining('colors'),
      'utf8'
    );
  });

  it('writes CSS content to disk', () => {
    exportPalette(mockPalette, 'css', '/out/palette.css');
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '/out/palette.css',
      expect.stringContaining(':root'),
      'utf8'
    );
  });

  it('throws on unsupported format', () => {
    expect(() => exportPalette(mockPalette, 'xml', '/out/p.xml')).toThrow(
      'Unsupported palette export format: xml'
    );
  });

  it('creates output directory if missing', () => {
    fs.existsSync = vi.fn().mockReturnValue(false);
    exportPalette(mockPalette, 'scss', '/new/dir/palette.scss');
    expect(fs.mkdirSync).toHaveBeenCalledWith('/new/dir', { recursive: true });
  });
});
