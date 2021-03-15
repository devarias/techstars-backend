const { request, expect } = require('./config');

before(async () => {
  console.log('Starting testing testing... \n\n');
});
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

/*describe('POST /api/mentors ', () => {
  it('Create a new mentor and respond with 201', async () => {
    const response = await request
      .post('/mentors')
      .send({ mentor: 'mentor test', email: 'email test' });
    expect(response.status).to.eql(200);
  });
  */

/*it('fail creating mentor and responds with a 400 code of bad request', (done) => {
    const data = {};
    request(app)
      .post('api/mentors')
      .send(data)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});*/
