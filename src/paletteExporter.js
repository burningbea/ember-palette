import { themeToCSS } from './theme.js';
import { gradientToCSS } from './gradientExporter.js';
import fs from 'fs';
import path from 'path';

/**
 * Export a palette as a flat JSON object with hex colors and metadata.
 */
export function paletteToJSON(palette, theme = null) {
  const result = {
    colors: palette.map(({ hex, label, vibrant }) => ({ hex, label, vibrant })),
  };
  if (theme) result.theme = theme;
  return JSON.stringify(result, null, 2);
}

/**
 * Export a palette as CSS custom properties.
 */
export function paletteToCSS(palette, theme = null) {
  const lines = [':root {'];
  palette.forEach(({ hex, label }, i) => {
    const varName = label
      ? `--color-${label.toLowerCase().replace(/\s+/g, '-')}`
      : `--color-${i + 1}`;
    lines.push(`  ${varName}: ${hex};`);
  });
  if (theme) {
    const themeCSS = themeToCSS(theme);
    const themeVars = themeCSS
      .replace(':root {', '')
      .replace(/}\s*$/, '')
      .trim();
    if (themeVars) lines.push('', '  /* theme */');
    themeVars.split('\n').forEach(line => line.trim() && lines.push(line));
  }
  lines.push('}');
  return lines.join('\n');
}

/**
 * Export a palette as SCSS variables.
 */
export function paletteToSCSS(palette) {
  return palette
    .map(({ hex, label }, i) => {
      const varName = label
        ? `$color-${label.toLowerCase().replace(/\s+/g, '-')}`
        : `$color-${i + 1}`;
      return `${varName}: ${hex};`;
    })
    .join('\n');
}

/**
 * Export a palette as an SVG swatch strip.
 * Each color is rendered as a labeled rectangle.
 * @param {Array} palette
 * @param {object} [options]
 * @param {number} [options.swatchWidth=80]
 * @param {number} [options.swatchHeight=60]
 * @returns {string} SVG markup
 */
export function paletteToSVG(palette, { swatchWidth = 80, swatchHeight = 60 } = {}) {
  const totalWidth = swatchWidth * palette.length;
  const rects = palette.map(({ hex, label }, i) => {
    const x = i * swatchWidth;
    const displayLabel = label || hex;
    return [
      `  <rect x="${x}" y="0" width="${swatchWidth}" height="${swatchHeight}" fill="${hex}" />`,
      `  <text x="${x + swatchWidth / 2}" y="${swatchHeight + 14}" text-anchor="middle" font-size="11" font-family="sans-serif" fill="#333">${displayLabel}</text>`,
    ].join('\n');
  });
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${swatchHeight + 20}">`,
    ...rects,
    '</svg>',
  ].join('\n');
}

/**
 * Write palette export to disk in the requested format.
 * @param {Array} palette
 * @param {string} format - 'json' | 'css' | 'scss' | 'svg'
 * @param {string} outputPath
 * @param {object|null} theme
 */
export function exportPalette(palette, format, outputPath, theme = null) {
  let content;
  if (format === 'json') content = paletteToJSON(palette, theme);
  else if (format === 'css') content = paletteToCSS(palette, theme);
  else if (format === 'scss') content = paletteToSCSS(palette);
  else if (format === 'svg') content = paletteToSVG(palette);
  else throw new Error(`Unsupported palette export format: ${format}`);

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, content, 'utf8');
  return content;
}
