/**
 * gradient.js
 * Generates CSS gradient strings from a color palette.
 */

/**
 * Interpolates between two hex colors at a given ratio (0-1).
 * @param {string} hex1
 * @param {string} hex2
 * @param {number} t
 * @returns {string}
 */
function interpolateHex(hex1, hex2, t) {
  const parse = (h) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(hex1);
  const [r2, g2, b2] = parse(hex2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Builds a linear CSS gradient string from an array of hex colors.
 * @param {string[]} colors
 * @param {number} [angle=90]
 * @returns {string}
 */
function buildLinearGradient(colors, angle = 90) {
  if (!colors || colors.length === 0) throw new Error('No colors provided');
  if (colors.length === 1) return `linear-gradient(${angle}deg, ${colors[0]}, ${colors[0]})`;
  const stops = colors.map((c, i) => {
    const pct = Math.round((i / (colors.length - 1)) * 100);
    return `${c} ${pct}%`;
  });
  return `linear-gradient(${angle}deg, ${stops.join(', ')})`;
}

/**
 * Builds a radial CSS gradient from the first two colors in the palette.
 * @param {string[]} colors
 * @returns {string}
 */
function buildRadialGradient(colors) {
  if (!colors || colors.length === 0) throw new Error('No colors provided');
  const inner = colors[0];
  const outer = colors[colors.length - 1];
  return `radial-gradient(circle, ${inner}, ${outer})`;
}

/**
 * Returns an object with both gradient variants.
 * @param {string[]} colors
 * @param {number} [angle=90]
 * @returns {{ linear: string, radial: string }}
 */
function generateGradients(colors, angle = 90) {
  return {
    linear: buildLinearGradient(colors, angle),
    radial: buildRadialGradient(colors),
  };
}

module.exports = { interpolateHex, buildLinearGradient, buildRadialGradient, generateGradients };
