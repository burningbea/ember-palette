const { buildHarmony } = require('./colorHarmony');

/**
 * Export harmony as JSON
 */
function harmonyToJSON(hex) {
  const harmony = buildHarmony(hex);
  return JSON.stringify(harmony, null, 2);
}

/**
 * Export harmony as CSS custom properties
 */
function harmonyToCSS(hex) {
  const harmony = buildHarmony(hex);
  const lines = [':root {'];
  lines.push(`  --color-base: ${harmony.base};`);
  harmony.complementary.forEach((c, i) =>
    lines.push(`  --color-complementary-${i + 1}: ${c};`)
  );
  harmony.triadic.forEach((c, i) =>
    lines.push(`  --color-triadic-${i + 1}: ${c};`)
  );
  harmony.analogous.forEach((c, i) =>
    lines.push(`  --color-analogous-${i + 1}: ${c};`)
  );
  harmony.splitComplementary.forEach((c, i) =>
    lines.push(`  --color-split-${i + 1}: ${c};`)
  );
  lines.push('}');
  return lines.join('\n');
}

/**
 * Export harmony as SCSS variables
 */
function harmonyToSCSS(hex) {
  const harmony = buildHarmony(hex);
  const lines = [];
  lines.push(`$color-base: ${harmony.base};`);
  harmony.complementary.forEach((c, i) =>
    lines.push(`$color-complementary-${i + 1}: ${c};`)
  );
  harmony.triadic.forEach((c, i) =>
    lines.push(`$color-triadic-${i + 1}: ${c};`)
  );
  harmony.analogous.forEach((c, i) =>
    lines.push(`$color-analogous-${i + 1}: ${c};`)
  );
  harmony.splitComplementary.forEach((c, i) =>
    lines.push(`$color-split-${i + 1}: ${c};`)
  );
  return lines.join('\n');
}

/**
 * Export harmony in the requested format
 */
function exportHarmony(hex, format = 'json') {
  switch (format) {
    case 'css': return harmonyToCSS(hex);
    case 'scss': return harmonyToSCSS(hex);
    case 'json':
    default: return harmonyToJSON(hex);
  }
}

module.exports = { harmonyToJSON, harmonyToCSS, harmonyToSCSS, exportHarmony };
