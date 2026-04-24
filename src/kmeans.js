/**
 * K-means clustering implementation for color quantization
 */

/**
 * Calculate Euclidean distance between two RGB colors
 * @param {number[]} a - [r, g, b]
 * @param {number[]} b - [r, g, b]
 * @returns {number}
 */
function colorDistance(a, b) {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
    Math.pow(a[1] - b[1], 2) +
    Math.pow(a[2] - b[2], 2)
  );
}

/**
 * Assign each pixel to its nearest centroid
 * @param {number[][]} pixels
 * @param {number[][]} centroids
 * @returns {number[]}
 */
function assignClusters(pixels, centroids) {
  return pixels.map(pixel => {
    let minDist = Infinity;
    let clusterIndex = 0;
    centroids.forEach((centroid, i) => {
      const dist = colorDistance(pixel, centroid);
      if (dist < minDist) {
        minDist = dist;
        clusterIndex = i;
      }
    });
    return clusterIndex;
  });
}

/**
 * Recalculate centroids as the mean of assigned pixels
 * @param {number[][]} pixels
 * @param {number[]} assignments
 * @param {number} k
 * @returns {number[][]}
 */
function recalculateCentroids(pixels, assignments, k) {
  return Array.from({ length: k }, (_, i) => {
    const cluster = pixels.filter((_, idx) => assignments[idx] === i);
    if (cluster.length === 0) return pixels[Math.floor(Math.random() * pixels.length)];
    const sum = cluster.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]);
    return sum.map(v => Math.round(v / cluster.length));
  });
}

/**
 * Run k-means clustering on an array of RGB pixels
 * @param {number[][]} pixels - Array of [r, g, b] values
 * @param {number} k - Number of clusters
 * @param {number} [maxIterations=10]
 * @returns {number[][]} - Final centroids (palette colors)
 */
function kmeans(pixels, k, maxIterations = 10) {
  if (pixels.length === 0) throw new Error('No pixels provided');
  if (k <= 0) throw new Error('k must be a positive integer');

  // Initialize centroids by picking random pixels
  const shuffled = [...pixels].sort(() => Math.random() - 0.5);
  let centroids = shuffled.slice(0, k);

  let assignments = [];
  for (let iter = 0; iter < maxIterations; iter++) {
    const newAssignments = assignClusters(pixels, centroids);
    const newCentroids = recalculateCentroids(pixels, newAssignments, k);

    const converged = newCentroids.every((c, i) => colorDistance(c, centroids[i]) < 1);
    centroids = newCentroids;
    assignments = newAssignments;

    if (converged) break;
  }

  return centroids;
}

module.exports = { kmeans, colorDistance, assignClusters, recalculateCentroids };
