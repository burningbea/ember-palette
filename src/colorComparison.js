// Compares two palettes and reports similarity, differences, and shared tones

const { nameColor } = require('./colorName');

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function euclideanDistance(a, b) {
  return Math.sqrt(
    Math.pow(a.r - b.r, 2) +
    Math.pow(a.g - b.g, 2) +
    Math.pow(a.b - b.b, 2)
  );
}

const SIMILARITY_THRESHOLD = 40;

function findClosestMatch(color, palette) {
  let closest = null;
  let minDist = Infinity;
  for (const candidate of palette) {
    const dist = euclideanDistance(color, hexToRgb(candidate.hex));
    if (dist < minDist) {
      minDist = dist;
      closest = { color: candidate, distance: dist };
    }
  }
  return closest;
}

function comparePalettes(paletteA, paletteB) {
  const shared = [];
  const uniqueToA = [];
  const uniqueToB = [];

  for (const colorA of paletteA) {
    const rgbA = hexToRgb(colorA.hex);
    const match = findClosestMatch(rgbA, paletteB);
    if (match && match.distance <= SIMILARITY_THRESHOLD) {
      shared.push({ from: colorA, to: match.color, distance: match.distance });
    } else {
      uniqueToA.push(colorA);
    }
  }

  for (const colorB of paletteB) {
    const rgbB = hexToRgb(colorB.hex);
    const match = findClosestMatch(rgbB, paletteA);
    if (!match || match.distance > SIMILARITY_THRESHOLD) {
      uniqueToB.push(colorB);
    }
  }

  const similarityScore = paletteA.length
    ? Math.round((shared.length / paletteA.length) * 100)
    : 0;

  return { shared, uniqueToA, uniqueToB, similarityScore };
}

module.exports = { hexToRgb, euclideanDistance, findClosestMatch, comparePalettes };
