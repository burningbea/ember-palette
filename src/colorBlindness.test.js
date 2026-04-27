const { simulateColor, simulatePalette, TYPES, hexToRgb, rgbToHex } = require('./colorBlindness');

describe('hexToRgb', () => {
  it('converts a hex string to rgb', () => {
    expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(hexToRgb('#1a2b3c')).toEqual({ r: 26, g: 43, b: 60 });
  });
});

describe('rgbToHex', () => {
  it('converts rgb back to hex', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
  });
});

describe('simulateColor', () => {
  it('returns a hex string for each known type', () => {
    for (const type of TYPES) {
      const result = simulateColor('#e63946', type);
      expect(result).toMatch(/^#[0-9a-f]{6}$/);
    }
  });

  it('achromatopsia produces a grey tone', () => {
    const result = simulateColor('#ff0000', 'achromatopsia');
    const { r, g, b } = hexToRgb(result);
    expect(r).toBe(g);
    expect(g).toBe(b);
  });

  it('throws on unknown type', () => {
    expect(() => simulateColor('#ffffff', 'unknown')).toThrow('Unknown type: unknown');
  });

  it('clamps values to 0-255', () => {
    const result = simulateColor('#ffffff', 'protanopia');
    const { r, g, b } = hexToRgb(result);
    expect(r).toBeGreaterThanOrEqual(0);
    expect(r).toBeLessThanOrEqual(255);
    expect(g).toBeGreaterThanOrEqual(0);
    expect(b).toBeLessThanOrEqual(255);
  });
});

describe('simulatePalette', () => {
  const palette = ['#e63946', '#457b9d', '#1d3557'];

  it('returns all types as keys', () => {
    const result = simulatePalette(palette);
    expect(Object.keys(result).sort()).toEqual([...TYPES].sort());
  });

  it('each type has same length as input', () => {
    const result = simulatePalette(palette);
    for (const type of TYPES) {
      expect(result[type]).toHaveLength(palette.length);
    }
  });

  it('each simulated color is a valid hex', () => {
    const result = simulatePalette(palette);
    for (const type of TYPES) {
      for (const hex of result[type]) {
        expect(hex).toMatch(/^#[0-9a-f]{6}$/);
      }
    }
  });
});
