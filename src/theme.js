/**
 * theme.js
 * Generates named color themes from extracted palettes.
 * Classifies colors into roles: primary, secondary, accent, background, text.
 */

const { rgbToHsl, isVibrant, sortByLuminance } = require('./colorUtils');

/**
 * Pick the most vibrant color from a list of hex colors.
 * @param {string[]} colors
 * @returns {string}
 */
function pickAccent(colors) {
  return colors.find(hex => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return isVibrant({ r, g, b });
  }) || colors[0];
}

/**
 * Build a theme object from a palette array.
 * @param {string[]} palette - array of hex color strings
 * @returns {object} theme
 */
function buildTheme(palette) {
  if (!palette || palette.length === 0) {
    throw new Error('Palette must contain at least one color.');
  }

  const sorted = sortByLuminance(palette);
  const background = sorted[sorted.length - 1]; // lightest
  const text = sorted[0];                        // darkest
  const accent = pickAccent(palette);
  const remaining = sorted.filter(c => c !== background && c !== text && c !== accent);
  const primary = remaining[0] || accent;
  const secondary = remaining[1] || primary;

  return { background, text, primary, secondary, accent };
}

/**
 * Format a theme as a CSS custom properties block.
 * @param {object} theme
 * @returns {string}
 */
function themeToCSS(theme) {
  return [
    ':root {',
    `  --color-background: ${theme.background};`,
    `  --color-text: ${theme.text};`,
    `  --color-primary: ${theme.primary};`,
    `  --color-secondary: ${theme.secondary};`,
    `  --color-accent: ${theme.accent};`,
    '}'
  ].join('\n');
}

module.exports = { pickAccent, buildTheme, themeToCSS };
