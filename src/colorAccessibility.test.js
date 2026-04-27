const {
  contrastRatio,
  wcagLevel,
  checkPairAccessibility,
  auditPalette,
  relativeLuminance,
  hexToRgb,
} = require('./colorAccessibility');

describe('hexToRgb', () => {
  it('parses a hex color correctly', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe('relativeLuminance', () => {
  it('returns 1 for white', () => {
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 2);
  });
  it('returns 0 for black', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
  });
});

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBe(21);
  });
  it('returns 1 for identical colors', () => {
    expect(contrastRatio('#aabbcc', '#aabbcc')).toBe(1);
  });
  it('is symmetric', () => {
    const a = contrastRatio('#123456', '#abcdef');
    const b = contrastRatio('#abcdef', '#123456');
    expect(a).toBe(b);
  });
});

describe('wcagLevel', () => {
  it('returns AAA for ratio >= 7', () => expect(wcagLevel(7.1)).toBe('AAA'));
  it('returns AA for ratio >= 4.5', () => expect(wcagLevel(5)).toBe('AA'));
  it('returns AA Large for ratio >= 3', () => expect(wcagLevel(3.5)).toBe('AA Large'));
  it('returns Fail for ratio < 3', () => expect(wcagLevel(2)).toBe('Fail'));
});

describe('checkPairAccessibility', () => {
  it('marks black on white as passing AAA', () => {
    const result = checkPairAccessibility('#000000', '#ffffff');
    expect(result.passes).toBe(true);
    expect(result.level).toBe('AAA');
    expect(result.ratio).toBe(21);
  });
  it('marks low-contrast pair as failing', () => {
    const result = checkPairAccessibility('#cccccc', '#ffffff');
    expect(result.passes).toBe(false);
    expect(result.level).toBe('Fail');
  });
});

describe('auditPalette', () => {
  it('audits each color against the background', () => {
    const results = auditPalette(['#000000', '#ffffff', '#cccccc'], '#ffffff');
    expect(results).toHaveLength(3);
    expect(results[0].passes).toBe(true);
    expect(results[1].passes).toBe(false);
  });
});
