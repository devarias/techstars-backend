const { request, expect } = require('./config');

describe('GET /api/reminder', () => {
  it('returns json verifying if no error sending reminder', async () => {
    const response = await request.get('/reminder/mentors');
    expect(response.status).to.eql(200);
    expect(response.body).to.include.keys('success');
  });
  it('returns json verifying if no error sending reminder', async () => {
    const response = await request.get('/reminder/companies');
    expect(response.status).to.eql(200);
    expect(response.body).to.include.keys('success');
  });
});
