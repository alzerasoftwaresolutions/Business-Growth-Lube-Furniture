import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createServer } from '../api/server';

describe('API - Health Foundation', () => {
  const app = createServer();

  it('GET /health returns 200 OK with system status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('alzersoftware-booking-core');
    expect(res.body.version).toBe('1.0.0');
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api/v1/health returns 200 OK via versioned router', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('alzersoftware-booking-core');
  });
});
