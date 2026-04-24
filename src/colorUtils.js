/**
 * Color utility functions for perceptual color analysis
 */

/**
 * Convert RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {{ h: number, s: number, l: number }}
 */
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Determine if a color is considered "vibrant" based on saturation and lightness
 * @param {{ r: number, g: number, b: number }} color
 * @returns {boolean}
 */
function isVibrant(color) {
  const { s, l } = rgbToHsl(color.r, color.g, color.b);
  return s > 40 && l > 20 && l < 80;
}

/**
 * Sort colors by perceived luminance (darkest to lightest)
 * @param {Array<{ r: number, g: number, b: number }>} colors
 * @returns {Array<{ r: number, g: number, b: number }>}
 */
function sortByLuminance(colors) {
  return [...colors].sort((a, b) => {
    const lumA = 0.2126 * a.r + 0.7152 * a.g + 0.0722 * a.b;
    const lumB = 0.2126 * b.r + 0.7152 * b.g + 0.0722 * b.b;
    return lumA - lumB;
  });
}

/**
 * Get a human-readable label for a color based on its HSL values
 * @param {{ r: number, g: number, b: number }} color
 * @returns {string}
 */
function getColorLabel(color) {
  const { h, s, l } = rgbToHsl(color.r, color.g, color.b);
  if (l < 15) return 'black';
  if (l > 85) return 'white';
  if (s < 15) return 'gray';
  if (h < 15 || h >= 345) return 'red';
  if (h < 45) return 'orange';
  if (h < 70) return 'yellow';
  if (h < 150) return 'green';
  if (h < 195) return 'cyan';
  if (h < 255) return 'blue';
  if (h < 285) return 'purple';
  if (h < 345) return 'pink';
  return 'red';
}

module.exports = { rgbToHsl, isVibrant, sortByLuminance, getColorLabel };
