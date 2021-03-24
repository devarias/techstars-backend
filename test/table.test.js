const { request, expect } = require('./config');

describe('GET /api/table', () => {
  it('responds with a json containing table data', async () => {
    const response = await request.get('/table');
    expect(response.status).to.eql(200);
    response.body.forEach((pending) => {
      expect(pending).to.include.keys(
        'mentor_id',
        'Mentor',
        'Email',
        'Day',
        'Block'
      );
    });
  });
});
