const fs = require('fs');
const path = require('path');
const {
  mixedPaletteToJSON,
  mixedPaletteToCSS,
  mixedPaletteToSCSS,
  exportMixedPalette,
} = require('./colorMixerExporter');

const sampleColors = ['#ff0000', '#0000ff', '#00ff00'];

describe('mixedPaletteToJSON', () => {
  test('returns valid JSON string', () => {
    const result = mixedPaletteToJSON({ average: '#555555', pairs: [], complements: [] });
    expect(() => JSON.parse(result)).not.toThrow();
    expect(JSON.parse(result).average).toBe('#555555');
  });
});

describe('mixedPaletteToCSS', () => {
  test('includes average variable', () => {
    const result = exportMixedPalette(sampleColors, 'css');
    expect(result).toContain('--palette-average');
  });

  test('includes mix variables', () => {
    const result = exportMixedPalette(sampleColors, 'css');
    expect(result).toContain('--palette-mix-0');
    expect(result).toContain('--palette-mix-1');
  });

  test('includes complement variables', () => {
    const result = exportMixedPalette(sampleColors, 'css');
    expect(result).toContain('--palette-complement-0');
  });
});

describe('mixedPaletteToSCSS', () => {
  test('uses $ variables', () => {
    const result = exportMixedPalette(sampleColors, 'scss');
    expect(result).toContain('$palette-average');
    expect(result).toContain('$palette-mix-0');
    expect(result).toContain('$palette-complement-0');
  });
});

describe('exportMixedPalette', () => {
  test('returns JSON by default', () => {
    const result = exportMixedPalette(sampleColors);
    expect(() => JSON.parse(result)).not.toThrow();
  });

  test('writes file when outputPath provided', () => {
    const outPath = path.join(__dirname, '../tmp/test-mixed.json');
    exportMixedPalette(sampleColors, 'json', outPath);
    expect(fs.existsSync(outPath)).toBe(true);
    fs.unlinkSync(outPath);
  });

  test('throws for invalid hex in input', () => {
    expect(() => exportMixedPalette(['notacolor', '#ff0000'])).toThrow();
  });
});
