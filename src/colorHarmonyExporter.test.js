const {
  harmonyToJSON,
  harmonyToCSS,
  harmonyToSCSS,
  exportHarmony,
} = require('./colorHarmonyExporter');

const BASE = '#ff0000';

describe('harmonyToJSON', () => {
  it('returns valid JSON', () => {
    const result = harmonyToJSON(BASE);
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('includes base color', () => {
    const parsed = JSON.parse(harmonyToJSON(BASE));
    expect(parsed.base).toBe(BASE);
  });

  it('includes all harmony keys', () => {
    const parsed = JSON.parse(harmonyToJSON(BASE));
    expect(parsed).toHaveProperty('complementary');
    expect(parsed).toHaveProperty('triadic');
    expect(parsed).toHaveProperty('analogous');
    expect(parsed).toHaveProperty('splitComplementary');
  });
});

describe('harmonyToCSS', () => {
  it('starts with :root block', () => {
    expect(harmonyToCSS(BASE)).toMatch(/^:root \{/);
  });

  it('includes base variable', () => {
    expect(harmonyToCSS(BASE)).toContain('--color-base:');
  });

  it('includes complementary variable', () => {
    expect(harmonyToCSS(BASE)).toContain('--color-complementary-1:');
  });

  it('includes triadic variables', () => {
    const css = harmonyToCSS(BASE);
    expect(css).toContain('--color-triadic-1:');
    expect(css).toContain('--color-triadic-2:');
  });

  it('closes the :root block', () => {
    expect(harmonyToCSS(BASE)).toMatch(/\}$/);
  });
});

describe('harmonyToSCSS', () => {
  it('uses $ prefix for variables', () => {
    expect(harmonyToSCSS(BASE)).toContain('$color-base:');
  });

  it('does not contain :root', () => {
    expect(harmonyToSCSS(BASE)).not.toContain(':root');
  });

  it('includes analogous variables', () => {
    const scss = harmonyToSCSS(BASE);
    expect(scss).toContain('$color-analogous-1:');
    expect(scss).toContain('$color-analogous-2:');
  });
});

describe('exportHarmony', () => {
  it('defaults to json format', () => {
    const result = exportHarmony(BASE);
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('returns css when requested', () => {
    expect(exportHarmony(BASE, 'css')).toContain(':root');
  });

  it('returns scss when requested', () => {
    expect(exportHarmony(BASE, 'scss')).toContain('$color-base');
  });

  it('falls back to json for unknown format', () => {
    const result = exportHarmony(BASE, 'xml');
    expect(() => JSON.parse(result)).not.toThrow();
  });
});
