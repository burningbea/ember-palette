const { rgbToHsl } = require('./colorUtils');

/**
 * Convert HSL to hex string
 */
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Parse a hex color to HSL
 */
function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return rgbToHsl(r, g, b);
}

/**
 * Generate complementary color (180 degrees)
 */
function complementary(hex) {
  const [h, s, l] = hexToHsl(hex);
  return [hslToHex((h + 180) % 360, s, l)];
}

/**
 * Generate triadic colors (120 degree splits)
 */
function triadic(hex) {
  const [h, s, l] = hexToHsl(hex);
  return [
    hslToHex((h + 120) % 360, s, l),
    hslToHex((h + 240) % 360, s, l),
  ];
}

/**
 * Generate analogous colors (±30 degrees)
 */
function analogous(hex) {
  const [h, s, l] = hexToHsl(hex);
  return [
    hslToHex((h + 30) % 360, s, l),
    hslToHex((h + 330) % 360, s, l),
  ];
}

/**
 * Generate split-complementary colors
 */
function splitComplementary(hex) {
  const [h, s, l] = hexToHsl(hex);
  return [
    hslToHex((h + 150) % 360, s, l),
    hslToHex((h + 210) % 360, s, l),
  ];
}

/**
 * Build a full harmony set from a base color
 */
function buildHarmony(hex) {
  return {
    base: hex,
    complementary: complementary(hex),
    triadic: triadic(hex),
    analogous: analogous(hex),
    splitComplementary: splitComplementary(hex),
  };
}

module.exports = {
  hslToHex,
  hexToHsl,
  complementary,
  triadic,
  analogous,
  splitComplementary,
  buildHarmony,
};
