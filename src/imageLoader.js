const Jimp = require('jimp');

/**
 * Loads an image from a file path and samples pixels from it.
 * @param {string} imagePath - Path to the image file
 * @param {number} sampleSize - Max number of pixels to sample
 * @returns {Promise<Array<{r, g, b}>>} Array of sampled pixel colors
 */
async function loadImagePixels(imagePath, sampleSize = 1000) {
  if (!imagePath || typeof imagePath !== 'string') {
    throw new Error('imagePath must be a non-empty string.');
  }
  if (typeof sampleSize !== 'number' || sampleSize < 1) {
    throw new Error('sampleSize must be a positive number.');
  }

  let image;
  try {
    image = await Jimp.read(imagePath);
  } catch (err) {
    throw new Error(`Failed to load image at "${imagePath}": ${err.message}`);
  }

  const pixels = [];
  const width = image.getWidth();
  const height = image.getHeight();
  const totalPixels = width * height;

  // Determine step size to evenly sample across the image
  const step = Math.max(1, Math.floor(totalPixels / sampleSize));

  image.scan(0, 0, width, height, function (x, y, idx) {
    const pixelIndex = y * width + x;
    if (pixelIndex % step !== 0) return;

    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    const a = this.bitmap.data[idx + 3];

    // Skip fully transparent pixels
    if (a < 128) return;

    pixels.push({ r, g, b });
  });

  if (pixels.length === 0) {
    throw new Error('No opaque pixels found in image.');
  }

  return pixels;
}

/**
 * Returns a hex string for a given {r, g, b} color object.
 * @param {{r: number, g: number, b: number}} color
 * @returns {string}
 */
function toHex({ r, g, b }) {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.round(v).toString(16).padStart(2, '0'))
      .join('')
  );
}

module.exports = { loadImagePixels, toHex };
