/**
 * themeExporter.js
 * Exports generated themes to various formats: CSS, JSON, SCSS.
 */

const fs = require('fs');
const path = require('path');
const { themeToCSS } = require('./theme');

/**
 * Serialize theme to JSON string.
 * @param {object} theme
 * @returns {string}
 */
function themeToJSON(theme) {
  return JSON.stringify(theme, null, 2);
}

/**
 * Serialize theme to SCSS variables.
 * @param {object} theme
 * @returns {string}
 */
function themeToSCSS(theme) {
  return Object.entries(theme)
    .map(([key, value]) => `$color-${key}: ${value};`)
    .join('\n');
}

/**
 * Write theme to a file based on the requested format.
 * @param {object} theme
 * @param {string} outputPath - destination file path
 * @param {'css'|'json'|'scss'} format
 */
function exportTheme(theme, outputPath, format = 'css') {
  let content;
  switch (format) {
    case 'json':
      content = themeToJSON(theme);
      break;
    case 'scss':
      content = themeToSCSS(theme);
      break;
    case 'css':
    default:
      content = themeToCSS(theme);
      break;
  }

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, content, 'utf8');
  return outputPath;
}

module.exports = { themeToJSON, themeToSCSS, exportTheme };
