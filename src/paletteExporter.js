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
 * Write palette export to disk in the requested format.
 * @param {Array} palette
 * @param {string} format - 'json' | 'css' | 'scss'
 * @param {string} outputPath
 * @param {object|null} theme
 */
export function exportPalette(palette, format, outputPath, theme = null) {
  let content;
  if (format === 'json') content = paletteToJSON(palette, theme);
  else if (format === 'css') content = paletteToCSS(palette, theme);
  else if (format === 'scss') content = paletteToSCSS(palette);
  else throw new Error(`Unsupported palette export format: ${format}`);

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, content, 'utf8');
  return content;
}
