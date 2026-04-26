// colorMixer.js — blend and mix colors from a palette

const { hexToRgb } = require('./colorComparison');

function rgbToHex({ r, g, b }) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0'))
      .join('')
  );
}

function mixTwo(hex1, hex2, weight = 0.5) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  if (!c1 || !c2) throw new Error(`Invalid hex color: ${!c1 ? hex1 : hex2}`);
  const w2 = Math.max(0, Math.min(1, weight));
  const w1 = 1 - w2;
  return rgbToHex({
    r: c1.r * w1 + c2.r * w2,
    g: c1.g * w1 + c2.g * w2,
    b: c1.b * w1 + c2.b * w2,
  });
}

function averageColors(hexColors) {
  if (!hexColors || hexColors.length === 0) throw new Error('No colors provided');
  const rgbs = hexColors.map((h) => {
    const c = hexToRgb(h);
    if (!c) throw new Error(`Invalid hex color: ${h}`);
    return c;
  });
  const n = rgbs.length;
  return rgbToHex({
    r: rgbs.reduce((s, c) => s + c.r, 0) / n,
    g: rgbs.reduce((s, c) => s + c.g, 0) / n,
    b: rgbs.reduce((s, c) => s + c.b, 0) / n,
  });
}

function complementary(hex) {
  const { r, g, b } = hexToRgb(hex) || {};
  if (r === undefined) throw new Error(`Invalid hex color: ${hex}`);
  return rgbToHex({ r: 255 - r, g: 255 - g, b: 255 - b });
}

function buildMixedPalette(hexColors) {
  if (hexColors.length < 2) return { average: hexColors[0] || null, pairs: [], complements: [] };
  const pairs = [];
  for (let i = 0; i < hexColors.length - 1; i++) {
    pairs.push({ a: hexColors[i], b: hexColors[i + 1], mix: mixTwo(hexColors[i], hexColors[i + 1]) });
  }
  const complements = hexColors.map((h) => ({ original: h, complement: complementary(h) }));
  return { average: averageColors(hexColors), pairs, complements };
}

module.exports = { rgbToHex, mixTwo, averageColors, complementary, buildMixedPalette };
