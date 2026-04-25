const { getHueName, getLightnessPrefix, nameColor, annotateColors } = require('./colorName');

describe('getHueName', () => {
  test('returns Red for hue 0', () => {
    expect(getHueName(0)).toBe('Red');
  });

  test('returns Orange for hue 30', () => {
    expect(getHueName(30)).toBe('Orange');
  });

  test('returns Blue for hue 220', () => {
    expect(getHueName(220)).toBe('Blue');
  });

  test('returns Green for hue 120', () => {
    expect(getHueName(120)).toBe('Green');
  });
});

describe('getLightnessPrefix', () => {
  test('returns "Dark " for low lightness', () => {
    expect(getLightnessPrefix(0.1)).toBe('Dark ');
  });

  test('returns "Light " for high lightness', () => {
    expect(getLightnessPrefix(0.9)).toBe('Light ');
  });

  test('returns empty string for mid lightness', () => {
    expect(getLightnessPrefix(0.5)).toBe('');
  });
});

describe('nameColor', () => {
  test('names a vivid red correctly', () => {
    expect(nameColor({ r: 220, g: 20, b: 20 })).toMatch(/Red/);
  });

  test('names a dark blue correctly', () => {
    const name = nameColor({ r: 0, g: 0, b: 80 });
    expect(name).toMatch(/Blue/);
  });

  test('names a light gray correctly', () => {
    const name = nameColor({ r: 210, g: 210, b: 210 });
    expect(name).toMatch(/Gray/);
  });

  test('names a muted green', () => {
    const name = nameColor({ r: 100, g: 130, b: 100 });
    expect(name).toMatch(/Green/);
  });
});

describe('annotateColors', () => {
  test('adds name field to each color', () => {
    const colors = [
      { r: 255, g: 0, b: 0, hex: '#ff0000' },
      { r: 0, g: 0, b: 255, hex: '#0000ff' },
    ];
    const result = annotateColors(colors);
    expect(result[0]).toHaveProperty('name');
    expect(result[1]).toHaveProperty('name');
    expect(result[0].hex).toBe('#ff0000');
  });

  test('preserves existing fields', () => {
    const colors = [{ r: 128, g: 128, b: 128, hex: '#808080', vibrant: false }];
    const result = annotateColors(colors);
    expect(result[0].vibrant).toBe(false);
  });
});
