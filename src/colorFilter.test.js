const { deduplicate, filterByLightness, filterByVibrance, applyFilters } = require('./colorFilter');

describe('deduplicate', () => {
  it('keeps colors that are far apart', () => {
    const colors = [
      { r: 255, g: 0, b: 0 },
      { r: 0, g: 0, b: 255 },
      { r: 0, g: 255, b: 0 },
    ];
    expect(deduplicate(colors, 25)).toHaveLength(3);
  });

  it('removes colors that are too similar', () => {
    const colors = [
      { r: 200, g: 50, b: 50 },
      { r: 205, g: 52, b: 48 }, // very close to first
      { r: 0, g: 0, b: 255 },
    ];
    const result = deduplicate(colors, 25);
    expect(result).toHaveLength(2);
  });

  it('returns empty array for empty input', () => {
    expect(deduplicate([], 25)).toEqual([]);
  });
});

describe('filterByLightness', () => {
  it('removes near-black colors', () => {
    const colors = [
      { r: 5, g: 5, b: 5 },
      { r: 128, g: 128, b: 128 },
    ];
    const result = filterByLightness(colors, 0.05, 0.95);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ r: 128, g: 128, b: 128 });
  });

  it('removes near-white colors', () => {
    const colors = [
      { r: 250, g: 250, b: 250 },
      { r: 100, g: 100, b: 200 },
    ];
    const result = filterByLightness(colors, 0.05, 0.95);
    expect(result).toHaveLength(1);
  });

  it('keeps colors within range', () => {
    const colors = [{ r: 100, g: 150, b: 200 }];
    expect(filterByLightness(colors)).toHaveLength(1);
  });
});

describe('filterByVibrance', () => {
  it('removes desaturated gray colors', () => {
    const colors = [
      { r: 128, g: 128, b: 128 }, // gray, s=0
      { r: 200, g: 50, b: 50 },  // saturated red
    ];
    const result = filterByVibrance(colors, 0.1);
    expect(result).toHaveLength(1);
    expect(result[0].r).toBe(200);
  });

  it('keeps vibrant colors', () => {
    const colors = [{ r: 255, g: 0, b: 128 }];
    expect(filterByVibrance(colors, 0.1)).toHaveLength(1);
  });
});

describe('applyFilters', () => {
  it('applies all filters and returns clean palette', () => {
    const colors = [
      { r: 5, g: 5, b: 5 },       // too dark
      { r: 250, g: 250, b: 250 }, // too light
      { r: 128, g: 128, b: 128 }, // gray
      { r: 200, g: 50, b: 50 },   // good
      { r: 202, g: 52, b: 49 },   // duplicate of above
      { r: 50, g: 50, b: 200 },   // good
    ];
    const result = applyFilters(colors);
    expect(result).toHaveLength(2);
  });

  it('returns empty array when all colors are filtered out', () => {
    const colors = [{ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }];
    expect(applyFilters(colors)).toHaveLength(0);
  });
});
