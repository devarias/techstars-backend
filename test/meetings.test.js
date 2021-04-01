const { request, expect } = require('./config');

describe('GET /api/meetings/', () => {
  it('returns json contining meetings data', async () => {
    const response = await request.get('/meetings');
    expect(response.status).to.eql(200);
    response.body.forEach((meeting) => {
      expect(meeting).to.include.keys(
        'meet_id',
        'mentor',
        'day',
        'block',
        'company',
        'slot',
        'created_at',
        'updated_at'
      );
    });
  });
});
