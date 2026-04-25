/**
 * gradientExporter.js
 * Exports generated gradients in various formats (CSS, JSON, SCSS).
 */

const { generateGradients } = require('./gradient');

/**
 * Exports gradients as a CSS snippet with named custom properties.
 * @param {string[]} colors
 * @param {number} [angle=90]
 * @returns {string}
 */
function gradientToCSS(colors, angle = 90) {
  const { linear, radial } = generateGradients(colors, angle);
  return [
    ':root {',
    `  --gradient-linear: ${linear};`,
    `  --gradient-radial: ${radial};`,
    '}',
  ].join('\n');
}

/**
 * Exports gradients as a JSON object.
 * @param {string[]} colors
 * @param {number} [angle=90]
 * @returns {string}
 */
function gradientToJSON(colors, angle = 90) {
  const gradients = generateGradients(colors, angle);
  return JSON.stringify(gradients, null, 2);
}

/**
 * Exports gradients as SCSS variables.
 * @param {string[]} colors
 * @param {number} [angle=90]
 * @returns {string}
 */
function gradientToSCSS(colors, angle = 90) {
  const { linear, radial } = generateGradients(colors, angle);
  return [
    `$gradient-linear: ${linear};`,
    `$gradient-radial: ${radial};`,
  ].join('\n');
}

/**
 * Dispatches to the correct exporter based on format string.
 * @param {string[]} colors
 * @param {'css'|'json'|'scss'} format
 * @param {number} [angle=90]
 * @returns {string}
 */
function exportGradient(colors, format = 'css', angle = 90) {
  switch (format) {
    case 'css':
      return gradientToCSS(colors, angle);
    case 'json':
      return gradientToJSON(colors, angle);
    case 'scss':
      return gradientToSCSS(colors, angle);
    default:
      throw new Error(`Unsupported gradient export format: ${format}`);
  }
}

module.exports = { gradientToCSS, gradientToJSON, gradientToSCSS, exportGradient };
