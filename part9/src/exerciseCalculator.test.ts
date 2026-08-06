import { calculateExercises } from './exerciseCalculator';

describe('calculateExercises', () => {
  test('calculates correct values for exercise period when target is met', () => {
    const result = calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 1.5);
    expect(result.periodLength).toBe(7);
    expect(result.trainingDays).toBe(5);
    expect(result.target).toBe(1.5);
    expect(result.success).toBe(true);
    expect(result.rating).toBe(3);
  });

  test('calculates correct values when target is not met', () => {
    const result = calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2);
    expect(result.success).toBe(false);
    expect(result.rating).toBe(2);
  });
});
