// Color accessibility utilities: contrast ratio, WCAG compliance checks

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function relativeLuminance({ r, g, b }) {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hexToRgb(hex1));
  const l2 = relativeLuminance(hexToRgb(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

function wcagLevel(ratio) {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

function checkPairAccessibility(hex1, hex2) {
  const ratio = contrastRatio(hex1, hex2);
  return {
    foreground: hex1,
    background: hex2,
    ratio,
    level: wcagLevel(ratio),
    passes: ratio >= 4.5,
  };
}

function auditPalette(colors, background = '#ffffff') {
  return colors.map((color) => checkPairAccessibility(color, background));
}

module.exports = {
  hexToRgb,
  relativeLuminance,
  contrastRatio,
  wcagLevel,
  checkPairAccessibility,
  auditPalette,
};
