const { request, expect } = require('./config');

describe('GET /api/pending/', () => {
  it('returns json contining pending surveys', async () => {
    const response = await request.get('/pending');
    expect(response.status).to.eql(200);
    response.body.forEach((pending) => {
      expect(pending).to.include.keys('mentor', 'Companies');
    });
  });
});
