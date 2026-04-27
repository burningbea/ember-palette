const { run } = require('./colorBlindness.cli');

describe('colorBlindness CLI', () => {
  let logSpy, errorSpy, exitSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('prints usage with --help', () => {
    run(['--help']);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage'));
  });

  it('prints usage with no args', () => {
    run([]);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Usage'));
  });

  it('simulates all types for given colors', () => {
    run(['#e63946', '#457b9d']);
    const output = logSpy.mock.calls.map(c => c[0]).join('\n');
    expect(output).toContain('Original');
    expect(output).toContain('protanopia');
    expect(output).toContain('deuteranopia');
    expect(output).toContain('tritanopia');
    expect(output).toContain('achromatopsia');
  });

  it('filters by --type', () => {
    run(['#e63946', '--type', 'tritanopia']);
    const output = logSpy.mock.calls.map(c => c[0]).join('\n');
    expect(output).toContain('tritanopia');
    expect(output).not.toContain('protanopia');
  });

  it('exits on invalid --type', () => {
    expect(() => run(['#e63946', '--type', 'faketype'])).toThrow('exit');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('invalid --type'));
  });

  it('exits when no valid hex colors provided', () => {
    expect(() => run(['notacolor'])).toThrow('exit');
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('at least one valid hex'));
  });

  it('accepts hex without leading #', () => {
    run(['e63946']);
    const output = logSpy.mock.calls.map(c => c[0]).join('\n');
    expect(output).toContain('#e63946');
  });
});
