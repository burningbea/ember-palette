const { mixTwo, averageColors, complementary, buildMixedPalette, rgbToHex } = require('./colorMixer');

describe('rgbToHex', () => {
  test('converts rgb to hex', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
    expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe('#00ff00');
    expect(rgbToHex({ r: 0, g: 0, b: 255 })).toBe('#0000ff');
  });

  test('clamps values', () => {
    expect(rgbToHex({ r: 300, g: -10, b: 128 })).toBe('#ff0080');
  });
});

describe('mixTwo', () => {
  test('mixes two colors equally by default', () => {
    const result = mixTwo('#ff0000', '#0000ff');
    expect(result).toBe('#800080');
  });

  test('respects weight parameter', () => {
    const result = mixTwo('#000000', '#ffffff', 1);
    expect(result).toBe('#ffffff');
  });

  test('throws on invalid hex', () => {
    expect(() => mixTwo('invalid', '#ff0000')).toThrow();
  });
});

describe('averageColors', () => {
  test('averages multiple colors', () => {
    const result = averageColors(['#ff0000', '#0000ff', '#00ff00']);
    expect(result).toBe('#555555');
  });

  test('throws on empty array', () => {
    expect(() => averageColors([])).toThrow();
  });

  test('returns same color for single input', () => {
    expect(averageColors(['#aabbcc'])).toBe('#aabbcc');
  });
});

describe('complementary', () => {
  test('returns complement of red', () => {
    expect(complementary('#ff0000')).toBe('#00ffff');
  });

  test('returns complement of white as black', () => {
    expect(complementary('#ffffff')).toBe('#000000');
  });

  test('throws on invalid hex', () => {
    expect(() => complementary('notacolor')).toThrow();
  });
});

describe('buildMixedPalette', () => {
  test('returns average, pairs, complements', () => {
    const result = buildMixedPalette(['#ff0000', '#0000ff']);
    expect(result).toHaveProperty('average');
    expect(result.pairs).toHaveLength(1);
    expect(result.complements).toHaveLength(2);
  });

  test('handles single color gracefully', () => {
    const result = buildMixedPalette(['#aabbcc']);
    expect(result.pairs).toHaveLength(0);
    expect(result.average).toBe('#aabbcc');
  });
});
