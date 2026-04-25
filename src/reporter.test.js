const { generateReport, FORMATS } = require('./reporter');

const MOCK_PALETTE = [
  { hex: '#ff5733', label: 'Vibrant Orange', hsl: [11, 100, 60], vibrant: true },
  { hex: '#2e86ab', label: 'Ocean Blue', hsl: [200, 58, 42], vibrant: false },
];

describe('generateReport', () => {
  test('FORMATS includes text, json, csv', () => {
    expect(FORMATS).toContain('text');
    expect(FORMATS).toContain('json');
    expect(FORMATS).toContain('csv');
  });

  test('text format includes hex values', () => {
    const output = generateReport(MOCK_PALETTE, 'text');
    expect(output).toContain('#ff5733');
    expect(output).toContain('#2e86ab');
  });

  test('text format includes labels', () => {
    const output = generateReport(MOCK_PALETTE, 'text');
    expect(output).toContain('Vibrant Orange');
    expect(output).toContain('Ocean Blue');
  });

  test('json format is valid JSON with correct structure', () => {
    const output = generateReport(MOCK_PALETTE, 'json');
    const parsed = JSON.parse(output);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].hex).toBe('#ff5733');
    expect(parsed[1].label).toBe('Ocean Blue');
  });

  test('csv format has header row', () => {
    const output = generateReport(MOCK_PALETTE, 'csv');
    const lines = output.split('\n');
    expect(lines[0]).toBe('hex,label,hue,saturation,lightness,vibrant');
  });

  test('csv format has correct data rows', () => {
    const output = generateReport(MOCK_PALETTE, 'csv');
    const lines = output.split('\n');
    expect(lines[1]).toContain('#ff5733');
    expect(lines[1]).toContain('true');
    expect(lines[2]).toContain('false');
  });

  test('csv row count matches palette length + header', () => {
    const output = generateReport(MOCK_PALETTE, 'csv');
    expect(output.split('\n').length).toBe(MOCK_PALETTE.length + 1);
  });

  test('defaults to text format', () => {
    const withDefault = generateReport(MOCK_PALETTE);
    const withText = generateReport(MOCK_PALETTE, 'text');
    expect(withDefault).toBe(withText);
  });

  test('throws on unsupported format', () => {
    expect(() => generateReport(MOCK_PALETTE, 'xml')).toThrow('Unsupported format');
  });
});
