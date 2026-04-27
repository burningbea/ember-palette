// Simulate color blindness transformations for palette accessibility

/**
 * Apply a 3x3 matrix transform to an RGB object
 * @param {{r,g,b}} rgb
 * @param {number[][]} matrix
 * @returns {{r,g,b}}
 */
function applyMatrix(rgb, matrix) {
  const { r, g, b } = rgb;
  return {
    r: Math.min(255, Math.max(0, Math.round(matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b))),
    g: Math.min(255, Math.max(0, Math.round(matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b))),
    b: Math.min(255, Math.max(0, Math.round(matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b))),
  };
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

const MATRICES = {
  protanopia: [
    [0.567, 0.433, 0.0],
    [0.558, 0.442, 0.0],
    [0.0,   0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0.0],
    [0.7,   0.3,   0.0],
    [0.0,   0.3,   0.7],
  ],
  tritanopia: [
    [0.95, 0.05,  0.0],
    [0.0,  0.433, 0.567],
    [0.0,  0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

const TYPES = Object.keys(MATRICES);

/**
 * Simulate a single hex color under a given color blindness type.
 * @param {string} hex
 * @param {string} type - one of protanopia, deuteranopia, tritanopia, achromatopsia
 * @returns {string} simulated hex
 */
function simulateColor(hex, type) {
  if (!MATRICES[type]) throw new Error(`Unknown type: ${type}`);
  return rgbToHex(applyMatrix(hexToRgb(hex), MATRICES[type]));
}

/**
 * Simulate an entire palette for all color blindness types.
 * @param {string[]} hexColors
 * @returns {Object} map of type -> simulated hex array
 */
function simulatePalette(hexColors) {
  const result = {};
  for (const type of TYPES) {
    result[type] = hexColors.map(hex => simulateColor(hex, type));
  }
  return result;
}

module.exports = { simulateColor, simulatePalette, TYPES, hexToRgb, rgbToHex };
