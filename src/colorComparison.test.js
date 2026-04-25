const {
  hexToRgb,
  euclideanDistance,
  findClosestMatch,
  comparePalettes,
} = require('./colorComparison');

describe('hexToRgb', () => {
  test('converts white', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
  });

  test('converts black', () => {
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
  });

  test('converts a mid color', () => {
    expect(hexToRgb('#1a2b3c')).toEqual({ r: 26, g: 43, b: 60 });
  });
});

describe('euclideanDistance', () => {
  test('returns 0 for identical colors', () => {
    expect(euclideanDistance({ r: 100, g: 100, b: 100 }, { r: 100, g: 100, b: 100 })).toBe(0);
  });

  test('returns non-zero for different colors', () => {
    expect(euclideanDistance({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toBeGreaterThan(0);
  });
});

describe('findClosestMatch', () => {
  const palette = [
    { hex: '#ff0000' },
    { hex: '#00ff00' },
    { hex: '#0000ff' },
  ];

  test('finds closest color in palette', () => {
    const match = findClosestMatch({ r: 250, g: 5, b: 5 }, palette);
    expect(match.color.hex).toBe('#ff0000');
  });

  test('returns a distance value', () => {
    const match = findClosestMatch({ r: 0, g: 0, b: 200 }, palette);
    expect(match).toHaveProperty('distance');
  });
});

describe('comparePalettes', () => {
  const palA = [{ hex: '#ff0000' }, { hex: '#00ff00' }];
  const palB = [{ hex: '#fe0101' }, { hex: '#ffffff' }];

  test('finds shared colors within threshold', () => {
    const result = comparePalettes(palA, palB);
    expect(result.shared.length).toBeGreaterThan(0);
  });

  test('reports unique colors in each palette', () => {
    const result = comparePalettes(palA, palB);
    expect(Array.isArray(result.uniqueToA)).toBe(true);
    expect(Array.isArray(result.uniqueToB)).toBe(true);
  });

  test('returns a similarity score between 0 and 100', () => {
    const result = comparePalettes(palA, palB);
    expect(result.similarityScore).toBeGreaterThanOrEqual(0);
    expect(result.similarityScore).toBeLessThanOrEqual(100);
  });

  test('returns 0 score for empty paletteA', () => {
    const result = comparePalettes([], palB);
    expect(result.similarityScore).toBe(0);
  });
});
