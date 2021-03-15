const { request, expect } = require('./config');

describe('GET /api/company_survey', () => {
  //range generator
  const range = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );
  it('responds with json containing list of mentors surveys', async () => {
    const response = await request.get('/mentor_survey');
    expect(response.status).to.eql(200);
    response.body.surveys.forEach((mentor_survey) => {
      expect(mentor_survey).to.include.keys(
        'survey_id',
        'company_id',
        'vote',
        'mentor_id',
        'feedback',
        'ranking'
      );
      expect(mentor_survey.vote).to.be.oneOf([null, 0, 1, 3]);
      expect(mentor_survey.ranking).to.be.oneOf(range(1, 5, 1));
    });
  });
});
describe('POST /mentor_survey ', async () => {
  it('create a new mentor survey', async () => {
    const companyRes = await request.get('/companies'),
      mentorRes = await request.get('/mentors'),
      mentorId = mentorRes.body[0].mentor_id,
      companyId = companyRes.body[0].company_id;
    const response = await request.post('/mentor_survey').send({
      company_id: companyId,
      mentor_id: mentorId,
      vote: 3,
      feedback: 'Test feedback',
      ranking: 5,
    });
    expect(response.status).to.eql(201); //200 to 201 in controller  <----
    const surveyId = String(response.body.data.survey_id);
    const deleteRes = await request.delete(`/mentor_survey/${surveyId}`);
    expect(deleteRes.status).to.eql(200);
    expect(deleteRes.body).to.include.keys('message', 'count');
  });
});
