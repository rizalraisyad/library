import { calculateDueDate } from '../calculate-date';

describe('calculateDueDate', () => {
  it('should correctly calculate the due date by adding the specified number of days', () => {
    const startDate = new Date('2024-05-23');
    const daysToAdd = 7;
    const expectedDueDate = new Date('2024-05-30');

    const result = calculateDueDate(startDate, daysToAdd);

    expect(result).toEqual(expectedDueDate);
  });

  it('should handle leap years correctly', () => {
    const startDate = new Date('2024-02-28');
    const daysToAdd = 1;
    const expectedDueDate = new Date('2024-02-29');

    const result = calculateDueDate(startDate, daysToAdd);

    expect(result).toEqual(expectedDueDate);
  });

  it('should handle month boundaries correctly', () => {
    const startDate = new Date('2024-01-31');
    const daysToAdd = 1;
    const expectedDueDate = new Date('2024-02-01');

    const result = calculateDueDate(startDate, daysToAdd);

    expect(result).toEqual(expectedDueDate);
  });

  it('should handle year boundaries correctly', () => {
    const startDate = new Date('2024-12-31');
    const daysToAdd = 1;
    const expectedDueDate = new Date('2025-01-01');

    const result = calculateDueDate(startDate, daysToAdd);

    expect(result).toEqual(expectedDueDate);
  });

  it('should return the same date if daysToAdd is zero', () => {
    const startDate = new Date('2024-05-23');
    const daysToAdd = 0;
    const expectedDueDate = new Date('2024-05-23');

    const result = calculateDueDate(startDate, daysToAdd);

    expect(result).toEqual(expectedDueDate);
  });

  it('should correctly handle negative daysToAdd', () => {
    const startDate = new Date('2024-05-23');
    const daysToAdd = -5;
    const expectedDueDate = new Date('2024-05-18');

    const result = calculateDueDate(startDate, daysToAdd);

    expect(result).toEqual(expectedDueDate);
  });
});
