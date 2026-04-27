const {
  hslToHex,
  hexToHsl,
  complementary,
  triadic,
  analogous,
  splitComplementary,
  buildHarmony,
} = require('./colorHarmony');

describe('hexToHsl', () => {
  it('converts red to hsl', () => {
    const [h, s, l] = hexToHsl('#ff0000');
    expect(h).toBe(0);
    expect(s).toBe(100);
    expect(l).toBe(50);
  });

  it('converts white correctly', () => {
    const [h, s, l] = hexToHsl('#ffffff');
    expect(l).toBe(100);
  });
});

describe('hslToHex', () => {
  it('converts hsl back to hex', () => {
    const hex = hslToHex(0, 100, 50);
    expect(hex).toBe('#ff0000');
  });

  it('round trips through hex and back', () => {
    const original = '#3399cc';
    const [h, s, l] = hexToHsl(original);
    const result = hslToHex(h, s, l);
    expect(result.toLowerCase()).toBe(original.toLowerCase());
  });
});

describe('complementary', () => {
  it('returns one color', () => {
    const result = complementary('#ff0000');
    expect(result).toHaveLength(1);
  });

  it('shifts hue by 180 degrees', () => {
    const result = complementary('#ff0000');
    const [h] = hexToHsl(result[0]);
    expect(h).toBe(180);
  });
});

describe('triadic', () => {
  it('returns two colors', () => {
    expect(triadic('#ff0000')).toHaveLength(2);
  });

  it('colors are 120 degrees apart from base', () => {
    const colors = triadic('#ff0000');
    const [h1] = hexToHsl(colors[0]);
    const [h2] = hexToHsl(colors[1]);
    expect(h1).toBe(120);
    expect(h2).toBe(240);
  });
});

describe('analogous', () => {
  it('returns two colors', () => {
    expect(analogous('#ff0000')).toHaveLength(2);
  });
});

describe('splitComplementary', () => {
  it('returns two colors', () => {
    expect(splitComplementary('#ff0000')).toHaveLength(2);
  });
});

describe('buildHarmony', () => {
  it('returns all harmony types', () => {
    const harmony = buildHarmony('#ff0000');
    expect(harmony.base).toBe('#ff0000');
    expect(harmony.complementary).toHaveLength(1);
    expect(harmony.triadic).toHaveLength(2);
    expect(harmony.analogous).toHaveLength(2);
    expect(harmony.splitComplementary).toHaveLength(2);
  });
});
