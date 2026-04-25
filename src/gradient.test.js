const {
  interpolateHex,
  buildLinearGradient,
  buildRadialGradient,
  generateGradients,
} = require('./gradient');

describe('interpolateHex', () => {
  test('returns first color at t=0', () => {
    expect(interpolateHex('#000000', '#ffffff', 0)).toBe('#000000');
  });

  test('returns second color at t=1', () => {
    expect(interpolateHex('#000000', '#ffffff', 1)).toBe('#ffffff');
  });

  test('returns midpoint at t=0.5', () => {
    expect(interpolateHex('#000000', '#ffffff', 0.5)).toBe('#808080');
  });

  test('interpolates RGB channels independently', () => {
    const result = interpolateHex('#ff0000', '#0000ff', 0.5);
    expect(result).toBe('#800080');
  });
});

describe('buildLinearGradient', () => {
  test('throws on empty array', () => {
    expect(() => buildLinearGradient([])).toThrow('No colors provided');
  });

  test('single color produces gradient with same color twice', () => {
    const result = buildLinearGradient(['#ff0000']);
    expect(result).toBe('linear-gradient(90deg, #ff0000, #ff0000)');
  });

  test('two colors produce correct stops', () => {
    const result = buildLinearGradient(['#000000', '#ffffff']);
    expect(result).toBe('linear-gradient(90deg, #000000 0%, #ffffff 100%)');
  });

  test('respects custom angle', () => {
    const result = buildLinearGradient(['#000000', '#ffffff'], 45);
    expect(result).toContain('45deg');
  });

  test('three colors include midpoint stop', () => {
    const result = buildLinearGradient(['#ff0000', '#00ff00', '#0000ff']);
    expect(result).toContain('50%');
  });
});

describe('buildRadialGradient', () => {
  test('throws on empty array', () => {
    expect(() => buildRadialGradient([])).toThrow('No colors provided');
  });

  test('uses first color as inner and last as outer', () => {
    const result = buildRadialGradient(['#ff0000', '#0000ff']);
    expect(result).toBe('radial-gradient(circle, #ff0000, #0000ff)');
  });

  test('single color uses same color for both stops', () => {
    const result = buildRadialGradient(['#aabbcc']);
    expect(result).toBe('radial-gradient(circle, #aabbcc, #aabbcc)');
  });
});

describe('generateGradients', () => {
  test('returns both linear and radial keys', () => {
    const result = generateGradients(['#ff0000', '#0000ff']);
    expect(result).toHaveProperty('linear');
    expect(result).toHaveProperty('radial');
  });

  test('linear uses default angle of 90', () => {
    const result = generateGradients(['#000000', '#ffffff']);
    expect(result.linear).toContain('90deg');
  });
});
