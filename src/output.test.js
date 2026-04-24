const { colorBlock, formatColorEntry, printPalette } = require('./output');

describe('colorBlock', () => {
  test('returns a string containing ANSI escape codes', () => {
    const result = colorBlock('#ff0000');
    expect(result).toContain('\x1b[48;2;255;0;0m');
    expect(result).toContain('\x1b[0m');
  });

  test('handles black correctly', () => {
    const result = colorBlock('#000000');
    expect(result).toContain('\x1b[48;2;0;0;0m');
  });

  test('handles white correctly', () => {
    const result = colorBlock('#ffffff');
    expect(result).toContain('\x1b[48;2;255;255;255m');
  });
});

describe('formatColorEntry', () => {
  const color = { hex: '#ff6347', rgb: [255, 99, 71], count: 500 };

  test('includes hex value in output', () => {
    const result = formatColorEntry(color, 1000);
    expect(result).toContain('#ff6347');
  });

  test('includes percentage in output', () => {
    const result = formatColorEntry(color, 1000);
    expect(result).toContain('50.0%');
  });

  test('handles zero totalPixels without crashing', () => {
    const result = formatColorEntry(color, 0);
    expect(result).toContain('0.0%');
  });

  test('includes color label', () => {
    const result = formatColorEntry(color, 1000);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(10);
  });
});

describe('printPalette', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('outputs JSON when json option is true', () => {
    const palette = [{ hex: '#aabbcc', rgb: [170, 187, 204], count: 100 }];
    printPalette(palette, { json: true });
    expect(consoleSpy).toHaveBeenCalledWith(JSON.stringify(palette, null, 2));
  });

  test('prints imagePath when provided', () => {
    const palette = [{ hex: '#aabbcc', rgb: [170, 187, 204], count: 100 }];
    printPalette(palette, { imagePath: 'photo.jpg' });
    const calls = consoleSpy.mock.calls.flat().join(' ');
    expect(calls).toContain('photo.jpg');
  });

  test('prints color count summary', () => {
    const palette = [
      { hex: '#aabbcc', rgb: [170, 187, 204], count: 100 },
      { hex: '#112233', rgb: [17, 34, 51], count: 200 }
    ];
    printPalette(palette, {});
    const calls = consoleSpy.mock.calls.flat().join(' ');
    expect(calls).toContain('2 colors extracted');
  });
});
