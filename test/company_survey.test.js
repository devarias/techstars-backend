const { request, expect } = require('./config');

describe('GET /api/company_survey', () => {
  it('responds with json containing list of company surveys', async () => {
    const response = await request.get('/company_survey');
    expect(response.status).to.eql(200);
    response.body.surveys.forEach((company_survey) => {
      expect(company_survey).to.include.keys(
        'survey_id',
        'company_id',
        'vote',
        'mentor_id',
        'feedback',
        'ranking'
      );
    });
  });
});
describe('POST /company_survey ', async () => {
  it('create a new company survey', async () => {
    const companyRes = await request.get('/companies'),
      mentorRes = await request.get('/mentors'),
      mentorId = mentorRes.body[0].mentor_id,
      companyId = companyRes.body[0].company_id;
    const response = await request.post('/company_survey').send({
      company_id: companyId,
      mentor_id: mentorId,
      vote: 3,
      feedback: 'Test feedback',
      ranking: 5,
    });
    expect(response.status).to.eql(201); //200 to 201 in controller  <----
    const deleteRes = await request.delete(
      `/company_survey/${response.body.data.survey_id}`
    );
    console.log(response.body.data.survey_id);
    /*expect(deleteRes.status).to.eql(200);
    expect(deleteRes.body).to.include.keys('message', 'count');*/
  });
});
