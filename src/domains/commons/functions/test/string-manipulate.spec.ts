import { camelize } from '../manipulate-string';

describe('string-utils', () => {
  describe('camelize', () => {
    it('should convert a string with spaces to camelCase', () => {
      const input = 'hello world';
      const expectedOutput = 'helloWorld';
      expect(camelize(input)).toBe(expectedOutput);
    });

    it('should handle single word strings', () => {
      const input = 'hello';
      const expectedOutput = 'hello';
      expect(camelize(input)).toBe(expectedOutput);
    });

    it('should handle empty strings', () => {
      const input = '';
      const expectedOutput = '';
      expect(camelize(input)).toBe(expectedOutput);
    });
  });
});
