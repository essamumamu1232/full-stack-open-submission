import * as diaryService from './services/diaryService';

describe('diaryService Unit Tests', () => {
  test('getEntries returns all diary entries including comments', () => {
    const entries = diaryService.getEntries();
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0]).toHaveProperty('comment');
  });

  test('getNonSensitiveEntries excludes comments from entries', () => {
    const nonSensitive = diaryService.getNonSensitiveEntries();
    expect(nonSensitive.length).toBeGreaterThan(0);
    nonSensitive.forEach(entry => {
      expect(entry).not.toHaveProperty('comment');
    });
  });

  test('findById returns matching entry or undefined', () => {
    const found = diaryService.findById(1);
    expect(found).toBeDefined();
    expect(found?.id).toBe(1);

    const notFound = diaryService.findById(9999);
    expect(notFound).toBeUndefined();
  });

  test('toNewDiaryEntry parses valid object correctly', () => {
    const raw = {
      date: '2026-08-05',
      weather: 'cloudy',
      visibility: 'ok',
      comment: 'Testing parser',
    };

    const parsed = diaryService.toNewDiaryEntry(raw);
    expect(parsed).toEqual(raw);
  });

  test('toNewDiaryEntry throws error on non-object input', () => {
    expect(() => diaryService.toNewDiaryEntry(null)).toThrow('Incorrect or missing data');
    expect(() => diaryService.toNewDiaryEntry('invalid')).toThrow('Incorrect or missing data');
  });

  test('toNewDiaryEntry throws error on missing fields', () => {
    const raw = { date: '2026-08-05' };
    expect(() => diaryService.toNewDiaryEntry(raw)).toThrow('Some fields are missing');
  });
});
