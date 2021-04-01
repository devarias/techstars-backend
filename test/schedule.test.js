const { request, expect } = require('./config');

describe('GET api/schedule', () => {
  it('return json with meeting data by mentor', async () => {
    const response = await request.get('/schedule');
    expect(response.status).to.eql(200);
    response.body.forEach((mentor_schedule) => {
      expect(mentor_schedule).to.include.keys(
        'mentor',
        'email',
        'day',
        'block',
        'Slots'
      );
      mentor_schedule.Slots.forEach((slot) => {
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
