const { request, expect } = require('./config');

describe('GET /api/companies', () => {
  it('responds with json containing list of companies', async () => {
    const response = await request.get('/companies');
    expect(response.status).to.eql(200);
    response.body.forEach((company) => {
      expect(company).to.include.keys('company_id', 'company', 'email');
    });
  });
});
describe('GET /api/mentors/:id', () => {
  it('responds with json containing a single company', async () => {
    const response = await request.get('/companies');
    const id = response.body[0].company_id;
    const resId = await request.get(`/companies/${id}`);
    expect(resId.status).to.eql(200);
    expect(resId.body).to.include.keys('company_id', 'company', 'email');
  });
});
