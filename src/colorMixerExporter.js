// colorMixerExporter.js — export mixed palette results in various formats

const fs = require('fs');
const path = require('path');
const { buildMixedPalette } = require('./colorMixer');

function mixedPaletteToJSON(mixed) {
  return JSON.stringify(mixed, null, 2);
}

function mixedPaletteToCSS(mixed) {
  const lines = ['/* ember-palette mixed palette */'];
  if (mixed.average) lines.push(`:root { --palette-average: ${mixed.average}; }`);
  mixed.pairs.forEach(({ a, b, mix }, i) => {
    lines.push(`:root { --palette-mix-${i}: ${mix}; /* ${a} + ${b} */ }`);
  });
  mixed.complements.forEach(({ original, complement }, i) => {
    lines.push(`:root { --palette-complement-${i}: ${complement}; /* of ${original} */ }`);
  });
  return lines.join('\n');
}

function mixedPaletteToSCSS(mixed) {
  const lines = ['// ember-palette mixed palette'];
  if (mixed.average) lines.push(`$palette-average: ${mixed.average};`);
  mixed.pairs.forEach(({ a, b, mix }, i) => {
    lines.push(`$palette-mix-${i}: ${mix}; // ${a} + ${b}`);
  });
  mixed.complements.forEach(({ original, complement }, i) => {
    lines.push(`$palette-complement-${i}: ${complement}; // of ${original}`);
  });
  return lines.join('\n');
}

function exportMixedPalette(hexColors, format = 'json', outputPath = null) {
  const mixed = buildMixedPalette(hexColors);
  let content;
  if (format === 'css') content = mixedPaletteToCSS(mixed);
  else if (format === 'scss') content = mixedPaletteToSCSS(mixed);
  else content = mixedPaletteToJSON(mixed);

  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, content, 'utf8');
  }
  return content;
}

module.exports = { mixedPaletteToJSON, mixedPaletteToCSS, mixedPaletteToSCSS, exportMixedPalette };
