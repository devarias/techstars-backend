const { request, expect } = require('./config');

describe('GET /api/mentors', () => {
  it('responds with json containing list of mentors', async () => {
    const response = await request.get('/mentors');
    expect(response.status).to.eql(200);
    response.body.forEach((mentor) => {
      expect(mentor).to.include.keys('mentor_id', 'mentor', 'email');
    });
  });
});
/* Remember modify getMentorById function in mentor.controller to avoid
spend a lot of time getting the 503 error (35 second aproximately)*/

describe('GET /api/mentors/nonexistingmentorid', () => {
  it('responds with an error', async () => {
    const response = await request.get('/mentors/nonexisting');
    expect(response.status).to.eql(404);
  });
});

describe('GET /api/mentors/:id', () => {
  it('responds with json containing a single mentor', async () => {
    const response = await request.get('/mentors');
    const id = response.body[0].mentor_id;
    const resId = await request.get(`/mentors/${id}`);
    expect(resId.status).to.eql(200);
    expect(resId.body).to.include.keys('mentor_id', 'mentor', 'email');
  });
});
