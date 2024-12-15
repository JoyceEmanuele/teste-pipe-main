import { IsNumberArray } from "./validatorNumber";

describe('IsNumberArray', () => {
  let isNumberArrayValidator: IsNumberArray;

  beforeEach(() => {
    isNumberArrayValidator = new IsNumberArray();
  });

  describe('validate', () => {
    it('should return false if value is not an array', () => {
      expect(isNumberArrayValidator.validate('not an array')).toBe(false);
      expect(isNumberArrayValidator.validate(123)).toBe(false);
      expect(isNumberArrayValidator.validate({})).toBe(false);
      expect(isNumberArrayValidator.validate(null)).toBe(false);
    });

    it('should return false if any item in the array is not a number', () => {
      expect(isNumberArrayValidator.validate([1, 2, 'three'])).toBe(false);
      expect(isNumberArrayValidator.validate([4, 'abc', 6])).toBe(false);
      expect(isNumberArrayValidator.validate([1, NaN, 3])).toBe(false);
      expect(isNumberArrayValidator.validate([1, undefined, 3])).toBe(false);
    });

    it('should return true for an empty array', () => {
      expect(isNumberArrayValidator.validate([])).toBe(true);
    });

    it('should return true if all items in the array are numbers', () => {
      expect(isNumberArrayValidator.validate([1, 2, 3])).toBe(true);
      expect(isNumberArrayValidator.validate(['1', '2', '3'])).toBe(true); // strings that can be converted to numbers
      expect(isNumberArrayValidator.validate([0, -1, 3.14])).toBe(true);
    });
  });

  describe('defaultMessage', () => {
    it('should return the correct default message', () => {
      expect(isNumberArrayValidator.defaultMessage()).toBe('Each value in the array must be a number');
    });
  });
});
