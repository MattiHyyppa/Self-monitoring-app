
import { superoak } from '../deps.js';
import app from '../app.js';
import { assertStringIncludes, assert } from '../deps.js';

Deno.test({
  name: 'GET /auth/registration should return 200 ok',
  async fn() {
    const testClient = await superoak(app);
    await testClient.get('/auth/registration').expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: 'POST /auth/registration with invalid email should fail',
  async fn() {
    const testClient = await superoak(app);
    const res = await testClient.post('/auth/registration').send('email=test_email&password=easy&verification=easy').expect(400);
    const html = res.text;
    assertStringIncludes(html, 'not an email');
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: 'POST /auth/registration with password !== verification should fail',
  async fn() {
    const testClient = await superoak(app);
    const res = await testClient.post('/auth/registration').send('email=mail@test.com\
      &password=easy1&verification=easy2').expect(400);
    const html = res.text;
    assertStringIncludes(html, 'passwords did not match');
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: 'POST /auth/registration with password.length < 4 should fail',
  async fn() {
    const testClient = await superoak(app);
    const res = await testClient.post('/auth/registration').send('email=mail@test.com\
      &password=abc&verification=abc').expect(400);
    const html = res.text;
    assertStringIncludes(html, 'Password should be at least 4 characters long');
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: 'GET /behavior/summary should redirect to login page if not authenticated',
  async fn() {
    const testClient = await superoak(app);
    const res = await testClient.get('/behavior/summary');
    const html = res.text;
    assertStringIncludes(html, 'log in to see your activities');
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: 'GET /behavior/reporting should redirect to login page if not authenticated',
  async fn() {
    const testClient = await superoak(app);
    const res = await testClient.get('/behavior/reporting');
    const html = res.text;
    assertStringIncludes(html, 'log in to see your activities');
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: 'GET /api/summary should be accessible for all',
  async fn() {
    const testClient = await superoak(app);
    const res = await testClient.get('/api/summary').expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: 'GET /api/summary/ should return averages',
  async fn() {
    const testClient = await superoak(app);
    const res = (await testClient.get('/api/summary')).body;
    const assertion = 'average_sleep_duration' in res && 'average_sleep_quality' in res &&
      'average_mood' in res && 'average_sport_duration' in res && 'average_study_duration' in res;
    assert(assertion);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: 'GET /api/summary/:year/:month/:day should be accessible for all',
  async fn() {
    const testClient = await superoak(app);
    const res = await testClient.get('/api/summary/2020/12/12').expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: 'GET /api/summary/:year/:month/:day should return averages',
  async fn() {
    const testClient = await superoak(app);
    const res = (await testClient.get('/api/summary/2020/12/12')).body;
    const assertion = 'average_sleep_duration' in res && 'average_sleep_quality' in res &&
      'average_mood' in res && 'average_sport_duration' in res && 'average_study_duration' in res;
    assert(assertion);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
