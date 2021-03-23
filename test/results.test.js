const { request, expect } = require('./config');

describe('GET /api/results', () => {
  it('responds with a json listing mentor results', async () => {
    //range generator
    const range = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );
    const response = await request.get('/results/mentors');
    expect(response.status).to.eql(200);
    const mentors = response.body[0];
    Object.values(mentors).forEach((mentorMatches) => {
      mentorMatches.forEach((mentorMatch) => {
        expect(mentorMatch).to.include.keys(
          'company',
          'mentorVote',
          'companyVote',
          'mentorRanking',
          'companyRanking',
          'mentorFeedback',
          'companyFeedback',
          'matchResult',
          'meetingDone'
        );
        expect(mentorMatch.mentorVote).to.be.oneOf([null, 0, 1, 3]);
        expect(mentorMatch.companyVote).to.be.oneOf([null, 0, 1, 2]);
        expect(mentorMatch.mentorRanking).to.be.oneOf(range(1, 5, 1));
        expect(mentorMatch.companyRanking).to.be.oneOf(range(1, 5, 1));
        expect(mentorMatch.meetingDone).to.be.oneOf([true, false]);
      });
    });
  });
  it('responds with a json listing company results', async () => {
    //range generator
    const range = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );
    const response = await request.get('/results/companies');
    expect(response.status).to.eql(200);
    const companies = response.body[0];
    Object.values(companies).forEach((mentorMatches) => {
      mentorMatches.forEach((mentorMatch) => {
        expect(mentorMatch).to.include.keys(
          'mentor',
          'mentorVote',
          'companyVote',
          'mentorRanking',
          'companyRanking',
          'mentorFeedback',
          'companyFeedback',
          'matchResult',
          'meetingDone'
        );
        expect(mentorMatch.mentorVote).to.be.oneOf([null, 0, 1, 3]);
        expect(mentorMatch.companyVote).to.be.oneOf([null, 0, 1, 2]);
        expect(mentorMatch.mentorRanking).to.be.oneOf(range(1, 5, 1));
        expect(mentorMatch.companyRanking).to.be.oneOf(range(1, 5, 1));
        expect(mentorMatch.meetingDone).to.be.oneOf([true, false]);
      });
    });
  });
});
