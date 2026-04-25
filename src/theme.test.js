const { pickAccent, buildTheme, themeToCSS } = require('./theme');

const samplePalette = [
  '#1a1a2e', // very dark
  '#16213e',
  '#0f3460',
  '#e94560', // vibrant
  '#f5f5f5'  // very light
];

describe('pickAccent', () => {
  test('returns a vibrant color when one exists', () => {
    const accent = pickAccent(samplePalette);
    expect(accent).toBe('#e94560');
  });

  test('falls back to first color when none are vibrant', () => {
    const muted = ['#5a5a5a', '#6b6b6b', '#7c7c7c'];
    const accent = pickAccent(muted);
    expect(accent).toBe(muted[0]);
  });
});

describe('buildTheme', () => {
  test('returns an object with all theme roles', () => {
    const theme = buildTheme(samplePalette);
    expect(theme).toHaveProperty('background');
    expect(theme).toHaveProperty('text');
    expect(theme).toHaveProperty('primary');
    expect(theme).toHaveProperty('secondary');
    expect(theme).toHaveProperty('accent');
  });

  test('background is the lightest color', () => {
    const theme = buildTheme(samplePalette);
    expect(theme.background).toBe('#f5f5f5');
  });

  test('text is the darkest color', () => {
    const theme = buildTheme(samplePalette);
    expect(theme.text).toBe('#1a1a2e');
  });

  test('accent is vibrant', () => {
    const theme = buildTheme(samplePalette);
    expect(theme.accent).toBe('#e94560');
  });

  test('throws on empty palette', () => {
    expect(() => buildTheme([])).toThrow('Palette must contain at least one color.');
  });

  test('handles single-color palette gracefully', () => {
    const theme = buildTheme(['#abcdef']);
    expect(theme.primary).toBe('#abcdef');
  });
});

describe('themeToCSS', () => {
  test('outputs valid CSS custom properties block', () => {
    const theme = buildTheme(samplePalette);
    const css = themeToCSS(theme);
    expect(css).toContain(':root {');
    expect(css).toContain('--color-background:');
    expect(css).toContain('--color-accent:');
    expect(css).toContain('}');
  });

  test('includes all five roles', () => {
    const theme = buildTheme(samplePalette);
    const css = themeToCSS(theme);
    ['background', 'text', 'primary', 'secondary', 'accent'].forEach(role => {
      expect(css).toContain(`--color-${role}`);
    });
  });
});
