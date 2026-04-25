/**
 * colorFilter.js
 * Utilities for filtering and deduplicating colors in a palette.
 */

const { colorDistance } = require('./kmeans');
const { rgbToHsl } = require('./colorUtils');

/**
 * Remove colors that are too similar to each other based on a distance threshold.
 * @param {Array<{r,g,b}>} colors
 * @param {number} threshold - minimum perceptual distance to keep a color
 * @returns {Array<{r,g,b}>}
 */
function deduplicate(colors, threshold = 25) {
  const result = [];
  for (const color of colors) {
    const tooClose = result.some(kept => colorDistance(color, kept) < threshold);
    if (!tooClose) {
      result.push(color);
    }
  }
  return result;
}

/**
 * Filter out near-black and near-white colors.
 * @param {Array<{r,g,b}>} colors
 * @param {number} lightnessMin - 0..1
 * @param {number} lightnessMax - 0..1
 * @returns {Array<{r,g,b}>}
 */
function filterByLightness(colors, lightnessMin = 0.05, lightnessMax = 0.95) {
  return colors.filter(color => {
    const [, , l] = rgbToHsl(color.r, color.g, color.b);
    return l >= lightnessMin && l <= lightnessMax;
  });
}

/**
 * Filter colors by minimum saturation to remove grays.
 * @param {Array<{r,g,b}>} colors
 * @param {number} minSaturation - 0..1
 * @returns {Array<{r,g,b}>}
 */
function filterByVibrance(colors, minSaturation = 0.1) {
  return colors.filter(color => {
    const [, s] = rgbToHsl(color.r, color.g, color.b);
    return s >= minSaturation;
  });
}

/**
 * Apply all filters and deduplication in sequence.
 * @param {Array<{r,g,b}>} colors
 * @param {object} options
 * @returns {Array<{r,g,b}>}
 */
function applyFilters(colors, options = {}) {
  const {
    lightnessMin = 0.05,
    lightnessMax = 0.95,
    minSaturation = 0.1,
    dedupeThreshold = 25,
  } = options;

  let filtered = filterByLightness(colors, lightnessMin, lightnessMax);
  filtered = filterByVibrance(filtered, minSaturation);
  filtered = deduplicate(filtered, dedupeThreshold);
  return filtered;
}

module.exports = { deduplicate, filterByLightness, filterByVibrance, applyFilters };
