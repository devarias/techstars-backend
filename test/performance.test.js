const { request, expect } = require('./config');

describe('GET /api/performance/', () => {
  it('returns json containing performance of mentors', async () => {
    const response = await request.get('/performance/mentors');
    expect(response.status).to.eql(200);
    Object.values(response.body).forEach((performance) => {
      expect(performance).to.include.keys(
        'wants',
        'willing',
        'wont',
        'totalVotes',
        'performance'
      );
    });
  });
  it('returns json containing performance of companies', async () => {
    const response = await request.get('/performance/companies');
    expect(response.status).to.eql(200);
    Object.values(response.body).forEach((performance) => {
      expect(performance).to.include.keys(
        'wants',
        'willing',
        'wont',
        'totalVotes',
        'performance'
      );
    });
  });
});
