const { kmeans, colorDistance, assignClusters, recalculateCentroids } = require('./kmeans');

describe('colorDistance', () => {
  test('returns 0 for identical colors', () => {
    expect(colorDistance([255, 0, 0], [255, 0, 0])).toBe(0);
  });

  test('calculates correct distance between black and white', () => {
    const dist = colorDistance([0, 0, 0], [255, 255, 255]);
    expect(dist).toBeCloseTo(441.67, 1);
  });

  test('is symmetric', () => {
    const a = [100, 150, 200];
    const b = [50, 80, 30];
    expect(colorDistance(a, b)).toBe(colorDistance(b, a));
  });
});

describe('assignClusters', () => {
  test('assigns pixels to nearest centroid', () => {
    const pixels = [[255, 0, 0], [0, 0, 255], [200, 0, 0]];
    const centroids = [[255, 0, 0], [0, 0, 255]];
    const assignments = assignClusters(pixels, centroids);
    expect(assignments).toEqual([0, 1, 0]);
  });
});

describe('recalculateCentroids', () => {
  test('computes mean of assigned pixels', () => {
    const pixels = [[100, 0, 0], [200, 0, 0], [0, 0, 100]];
    const assignments = [0, 0, 1];
    const centroids = recalculateCentroids(pixels, assignments, 2);
    expect(centroids[0]).toEqual([150, 0, 0]);
    expect(centroids[1]).toEqual([0, 0, 100]);
  });
});

describe('kmeans', () => {
  test('throws on empty pixel array', () => {
    expect(() => kmeans([], 3)).toThrow('No pixels provided');
  });

  test('throws when k is 0', () => {
    expect(() => kmeans([[255, 0, 0]], 0)).toThrow('k must be a positive integer');
  });

  test('returns k centroids', () => {
    const pixels = Array.from({ length: 50 }, (_, i) => [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    ]);
    const palette = kmeans(pixels, 4);
    expect(palette).toHaveLength(4);
    palette.forEach(color => {
      expect(color).toHaveLength(3);
      color.forEach(channel => {
        expect(channel).toBeGreaterThanOrEqual(0);
        expect(channel).toBeLessThanOrEqual(255);
      });
    });
  });

  test('clusters clearly separated colors correctly', () => {
    const reds = Array.from({ length: 20 }, () => [255, 0, 0]);
    const blues = Array.from({ length: 20 }, () => [0, 0, 255]);
    const palette = kmeans([...reds, ...blues], 2);
    const hasRed = palette.some(c => c[0] > 200 && c[2] < 50);
    const hasBlue = palette.some(c => c[2] > 200 && c[0] < 50);
    expect(hasRed).toBe(true);
    expect(hasBlue).toBe(true);
  });
});
