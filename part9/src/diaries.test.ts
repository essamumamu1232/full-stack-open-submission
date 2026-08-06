import supertest from 'supertest';
import { app } from './index';

const api = supertest(app);

describe('Flight Diaries API (/api/diaries)', () => {
  test('returns non-sensitive diary entries as JSON', async () => {
    const response = await api
      .get('/api/diaries')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    // Non-sensitive entries must not contain the comment field
    expect(response.body[0]).not.toHaveProperty('comment');
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('date');
    expect(response.body[0]).toHaveProperty('weather');
    expect(response.body[0]).toHaveProperty('visibility');
  });

  test('returns a single diary entry by ID', async () => {
    const response = await api.get('/api/diaries/1').expect(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('comment');
  });

  test('returns 404 for a non-existent diary ID', async () => {
    await api.get('/api/diaries/99999').expect(404);
  });

  test('successfully creates a new diary entry with valid data', async () => {
    const newEntry = {
      date: '2026-08-01',
      weather: 'sunny',
      visibility: 'great',
      comment: 'Smooth flight under clear skies.',
    };

    const response = await api
      .post('/api/diaries')
      .send(newEntry)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveProperty('id');
    expect(response.body.date).toBe(newEntry.date);
    expect(response.body.weather).toBe(newEntry.weather);
    expect(response.body.visibility).toBe(newEntry.visibility);
    expect(response.body.comment).toBe(newEntry.comment);
  });

  test('returns 400 when creating a diary entry with missing fields', async () => {
    const invalidEntry = {
      date: '2026-08-01',
      weather: 'sunny',
      // missing visibility & comment
    };

    await api.post('/api/diaries').send(invalidEntry).expect(400);
  });

  test('returns 400 when creating a diary entry with invalid weather value', async () => {
    const invalidEntry = {
      date: '2026-08-01',
      weather: 'tornado',
      visibility: 'good',
      comment: 'Stormy test.',
    };

    await api.post('/api/diaries').send(invalidEntry).expect(400);
  });
});
