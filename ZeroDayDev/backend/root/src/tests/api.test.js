'use strict';
// ════════════════════════════════════════════════════════════════════════════
// tests/highlights.test.js
// ════════════════════════════════════════════════════════════════════════════
// Run:  npm test
//
// Uses supertest + jest. MongoDB/Redis must be running (or use mocks).
// For CI, set MONGO_URI to a mongo-memory-server URI.
// ════════════════════════════════════════════════════════════════════════════

const request = require('supertest');
const app     = require('../src/app');

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /api/highlights', () => {
  it('returns success shape', async () => {
    const res = await request(app).get('/api/highlights');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('coreTeam');
    expect(res.body.data).toHaveProperty('featuredProjects');
    expect(res.body.data).toHaveProperty('stats');
  });
});

describe('GET /api/members', () => {
  it('returns an array', async () => {
    const res = await request(app).get('/api/members');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('GET /api/projects', () => {
  it('returns paginated shape', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('pagination');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('supports category filter', async () => {
    const res = await request(app).get('/api/projects?category=web');
    expect(res.status).toBe(200);
  });
});

describe('POST /api/members (auth guard)', () => {
  it('returns 401 without token', async () => {
    const res = await request(app).post('/api/members').send({ name: 'Test' });
    expect(res.status).toBe(401);
  });

  it('returns 401 with bad token', async () => {
    const res = await request(app)
      .post('/api/members')
      .set('Authorization', 'Bearer badtoken')
      .send({ name: 'Test' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/chat/rooms', () => {
  it('returns an array of room names', async () => {
    const res = await request(app).get('/api/chat/rooms');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('404 handler', () => {
  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
