import supertest from 'supertest';
import { app } from './index';

const api = supertest(app);

describe('Calculator Endpoints API', () => {
  describe('GET /api/ping', () => {
    test('returns pong with status 200', async () => {
      const response = await api.get('/api/ping').expect(200);
      expect(response.text).toBe('pong');
    });
  });

  describe('GET /api/bmi', () => {
    test('returns valid BMI result for valid parameters', async () => {
      const response = await api
        .get('/api/bmi?height=180&weight=74')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toEqual({
        weight: 74,
        height: 180,
        bmi: 'Normal (healthy weight)',
      });
    });

    test('returns 400 error for missing height or weight', async () => {
      const response = await api.get('/api/bmi?height=180').expect(400);
      expect(response.body).toEqual({ error: 'malformatted parameters' });
    });

    test('returns 400 error for invalid non-numeric parameters', async () => {
      const response = await api.get('/api/bmi?height=abc&weight=74').expect(400);
      expect(response.body).toEqual({ error: 'malformatted parameters' });
    });
  });

  describe('POST /api/exercises', () => {
    test('calculates exercises correctly for valid payload', async () => {
      const payload = {
        daily_exercises: [1, 0, 2, 0, 3, 0, 2.5],
        target: 2,
      };

      const response = await api
        .post('/api/exercises')
        .send(payload)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toHaveProperty('periodLength', 7);
      expect(response.body).toHaveProperty('trainingDays', 4);
      expect(response.body).toHaveProperty('target', 2);
    });

    test('returns 400 when parameters are missing', async () => {
      const response = await api
        .post('/api/exercises')
        .send({ target: 2 })
        .expect(400);

      expect(response.body).toEqual({ error: 'parameters missing' });
    });

    test('returns 400 when parameters are malformatted', async () => {
      const response = await api
        .post('/api/exercises')
        .send({ daily_exercises: 'not-an-array', target: 2 })
        .expect(400);

      expect(response.body).toEqual({ error: 'malformatted parameters' });
    });
  });
});
