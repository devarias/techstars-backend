const { request, expect } = require('./config');

describe('GET /api/schedule', () => {
  it('responds with a json file containing meetings data by mentor', async () => {
    const response = await request.get('/schedule');
    response.body.forEach((mentorData) => {
      expect(response.status).to.eql(200);
      expect(mentorData).to.include.keys(
        'mentor',
        'email',
        'day',
        'block',
        'Slots'
      );
      mentorData.Slots.forEach((slot) => {
        expect(slot).to.include.keys(
          'slot',
          'company',
          'created_at',
          'updated_at'
        );
      });
    });
  });
});
describe('GET /api/meetings', () => {
  it('responds with a json containing list of meetings data', async () => {
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
