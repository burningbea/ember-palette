const { rgbToHsl, isVibrant, sortByLuminance, getColorLabel } = require('./colorUtils');

describe('rgbToHsl', () => {
  test('converts pure red correctly', () => {
    const result = rgbToHsl(255, 0, 0);
    expect(result.h).toBe(0);
    expect(result.s).toBe(100);
    expect(result.l).toBe(50);
  });

  test('converts white correctly', () => {
    const result = rgbToHsl(255, 255, 255);
    expect(result.s).toBe(0);
    expect(result.l).toBe(100);
  });

  test('converts black correctly', () => {
    const result = rgbToHsl(0, 0, 0);
    expect(result.s).toBe(0);
    expect(result.l).toBe(0);
  });

  test('converts a mid-tone blue', () => {
    const result = rgbToHsl(70, 130, 180);
    expect(result.h).toBeGreaterThan(200);
    expect(result.h).toBeLessThan(215);
  });
});

describe('isVibrant', () => {
  test('returns true for a vibrant color', () => {
    expect(isVibrant({ r: 220, g: 50, b: 50 })).toBe(true);
  });

  test('returns false for a near-white color', () => {
    expect(isVibrant({ r: 240, g: 240, b: 240 })).toBe(false);
  });

  test('returns false for a near-black color', () => {
    expect(isVibrant({ r: 10, g: 10, b: 10 })).toBe(false);
  });

  test('returns false for a desaturated gray', () => {
    expect(isVibrant({ r: 128, g: 128, b: 128 })).toBe(false);
  });
});

describe('sortByLuminance', () => {
  test('sorts colors from dark to light', () => {
    const colors = [
      { r: 255, g: 255, b: 255 },
      { r: 0, g: 0, b: 0 },
      { r: 128, g: 128, b: 128 }
    ];
    const sorted = sortByLuminance(colors);
    expect(sorted[0]).toEqual({ r: 0, g: 0, b: 0 });
    expect(sorted[2]).toEqual({ r: 255, g: 255, b: 255 });
  });

  test('does not mutate original array', () => {
    const colors = [{ r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255 }];
    const original = [...colors];
    sortByLuminance(colors);
    expect(colors).toEqual(original);
  });
});

describe('getColorLabel', () => {
  test('labels black correctly', () => {
    expect(getColorLabel({ r: 5, g: 5, b: 5 })).toBe('black');
  });

  test('labels white correctly', () => {
    expect(getColorLabel({ r: 250, g: 250, b: 250 })).toBe('white');
  });

  test('labels a vivid blue correctly', () => {
    expect(getColorLabel({ r: 0, g: 0, b: 200 })).toBe('blue');
  });

  test('labels a vivid green correctly', () => {
    expect(getColorLabel({ r: 0, g: 180, b: 0 })).toBe('green');
  });
});
