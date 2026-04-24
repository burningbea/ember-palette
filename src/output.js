/**
 * output.js - Formats and renders palette results to the terminal
 */

const { getColorLabel } = require('./colorUtils');

/**
 * Renders a colored block in the terminal using ANSI escape codes
 * @param {string} hex - Hex color string e.g. "#ff6347"
 * @returns {string} ANSI-colored block string
 */
function colorBlock(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `\x1b[48;2;${r};${g};${b}m   \x1b[0m`;
}

/**
 * Formats a single palette entry as a readable string
 * @param {{ hex: string, rgb: number[], count: number }} color
 * @param {number} totalPixels
 * @returns {string}
 */
function formatColorEntry(color, totalPixels) {
  const block = colorBlock(color.hex);
  const label = getColorLabel(color.rgb);
  const pct = totalPixels > 0
    ? ((color.count / totalPixels) * 100).toFixed(1)
    : '0.0';
  return `${block}  ${color.hex}  ${label.padEnd(12)}  ${pct}%`;
}

/**
 * Prints the full palette to stdout
 * @param {Array<{ hex: string, rgb: number[], count: number }>} palette
 * @param {object} options
 * @param {boolean} [options.json] - Output as JSON instead of pretty print
 * @param {string} [options.imagePath] - Source image path for display
 */
function printPalette(palette, options = {}) {
  if (options.json) {
    console.log(JSON.stringify(palette, null, 2));
    return;
  }

  const totalPixels = palette.reduce((sum, c) => sum + (c.count || 0), 0);

  if (options.imagePath) {
    console.log(`\n🎨 Palette for: ${options.imagePath}`);
  } else {
    console.log('\n🎨 Extracted Palette:');
  }

  console.log('─'.repeat(44));
  palette.forEach(color => {
    console.log(formatColorEntry(color, totalPixels));
  });
  console.log('─'.repeat(44));
  console.log(`  ${palette.length} colors extracted\n`);
}

module.exports = { colorBlock, formatColorEntry, printPalette };
