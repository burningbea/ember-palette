/**
 * palette.js
 * Orchestrates image loading, k-means clustering, filtering, and palette output.
 */

const { kmeans } = require('./kmeans');
const { loadImagePixels } = require('./imageLoader');
const { applyFilters } = require('./colorFilter');
const { sortByLuminance } = require('./colorUtils');

const DEFAULT_K = 8;
const DEFAULT_MAX_ITER = 20;

/**
 * Extract a color palette from an image file.
 * @param {string} imagePath
 * @param {object} options
 * @param {number} options.k - number of colors to extract
 * @param {number} options.maxIterations
 * @param {boolean} options.filterColors - apply vibrance/lightness filtering
 * @param {object} options.filterOptions - options passed to applyFilters
 * @returns {Promise<Array<{r,g,b,hex}>>}
 */
async function extractPalette(imagePath, options = {}) {
  const {
    k = DEFAULT_K,
    maxIterations = DEFAULT_MAX_ITER,
    filterColors = true,
    filterOptions = {},
  } = options;

  const pixels = await loadImagePixels(imagePath);

  if (!pixels || pixels.length === 0) {
    throw new Error(`No pixels loaded from image: ${imagePath}`);
  }

  const centroids = kmeans(pixels, k, maxIterations);

  const colors = filterColors
    ? applyFilters(centroids, filterOptions)
    : centroids;

  const sorted = sortByLuminance(colors);

  return sorted;
}

/**
 * Build a simple palette summary object.
 * @param {Array<{r,g,b,hex}>} colors
 * @returns {{ count: number, colors: Array }}
 */
function buildPaletteSummary(colors) {
  return {
    count: colors.length,
    colors: colors.map((c, i) => ({
      index: i,
      r: c.r,
      g: c.g,
      b: c.b,
      hex: c.hex || `#${[c.r, c.g, c.b].map(v => v.toString(16).padStart(2, '0')).join('')}`,
    })),
  };
}

module.exports = { extractPalette, buildPaletteSummary };
