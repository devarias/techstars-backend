const { request, expect } = require('./config');

describe('GET /api/results/:option', () => {
  it('returns a json with matching results for mentors', async () => {
    const response = await request.get('/results/mentors');
    expect(response.status).to.be.eql(200);
    const results = response.body[0];
    Object.values(results).forEach((mentorResults) => {
      mentorResults.forEach((result) => {
        expect(result).to.include.keys(
          'mentor_id',
          'company',
          'company_id',
          'mentorVote',
          'companyVote',
          'companyRanking',
          'mentorRanking',
          'mentorFeedback',
          'companyFeedback',
          'matchResult',
          'meetingDone',
          'survey_id'
        );
      });
    });
  });
  it('return json with matching results for companies', async () => {
    const response = await request.get('/results/companies');
    expect(response.status).to.be.eql(200);
    const results = response.body[0];
    Object.values(results).forEach((companyResults) => {
      companyResults.forEach((result) => {
        expect(result).to.include.keys(
          'mentor_id',
          'mentor',
          'company_id',
          'mentorVote',
          'companyVote',
          'companyRanking',
          'mentorRanking',
          'mentorFeedback',
          'companyFeedback',
          'matchResult',
          'meetingDone',
          'survey_id'
        );
      });
    });
  });
});
