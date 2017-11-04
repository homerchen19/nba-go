import { convertToCm, convertToKg } from '../convertUnit';

describe('convertUnit', () => {
  describe('convertToCm', () => {
    it('should convert foot-inches to cm', () => {
      const result = convertToCm('6-11');

      expect(result).toBe('210.82');
      expect(typeof result).toBe('string');
    });

    it('should return empty string when pass empty string to it', () => {
      const result = convertToCm('');

      expect(result).toBe('');
      expect(typeof result).toBe('string');
    });
  });

  describe('convertToKg', () => {
    it('should convert pounds to kg', () => {
      const result = convertToKg(100);

      expect(result).toBe('45.36');
      expect(typeof result).toBe('string');
    });

    it('should return empty string when pass empty string to it', () => {
      const result = convertToKg('');

      expect(result).toBe('');
      expect(typeof result).toBe('string');
    });
  });
});
