import { calculateBmi } from './bmiCalculator';

describe('calculateBmi', () => {
  test('returns Underweight for BMI < 18.5', () => {
    expect(calculateBmi(180, 50)).toBe('Underweight');
  });

  test('returns Normal (healthy weight) for normal BMI', () => {
    expect(calculateBmi(180, 74)).toBe('Normal (healthy weight)');
  });

  test('returns Overweight for BMI between 25 and 30', () => {
    expect(calculateBmi(180, 85)).toBe('Overweight');
  });

  test('returns Obese for high BMI', () => {
    expect(calculateBmi(180, 105)).toBe('Obese');
  });
});
