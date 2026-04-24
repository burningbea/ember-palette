const { loadImagePixels, toHex } = require('./imageLoader');
const { kmeans } = require('./kmeans');

/**
 * Extracts a color palette from an image file.
 *
 * @param {string} imagePath - Path to the source image
 * @param {object} options
 * @param {number} [options.colors=6]      - Number of palette colors to extract
 * @param {number} [options.sampleSize=1000] - Pixels to sample from the image
 * @param {number} [options.maxIterations=50] - K-means iteration limit
 * @returns {Promise<Array<{hex: string, rgb: {r,g,b}, count: number}>>}
 */
async function extractPalette(imagePath, options = {}) {
  const { colors = 6, sampleSize = 1000, maxIterations = 50 } = options;

  if (colors < 1 || colors > 32) {
    throw new Error('colors must be between 1 and 32');
  }

  const pixels = await loadImagePixels(imagePath, sampleSize);

  if (pixels.length < colors) {
    throw new Error(
      `Not enough unique pixels (${pixels.length}) to form ${colors} clusters.`
    );
  }

  const centroids = kmeans(pixels, colors, maxIterations);

  // Sort palette by perceived luminance (darkest → lightest)
  const sorted = centroids
    .map((rgb) => ({
      hex: toHex(rgb),
      rgb,
      luminance: 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b,
    }))
    .sort((a, b) => a.luminance - b.luminance)
    .map(({ hex, rgb }) => ({ hex, rgb }));

  return sorted;
}

module.exports = { extractPalette };
