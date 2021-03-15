const { request, expect } = require('./config');

describe('GET /api/results', () => {
  it('responds with a json listing results', async () => {
    //range generator
    const range = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (_, i) => start + i * step
      );
    const response = await request.get('/results');
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
          'matchResult'
        );
        expect(mentorMatch.mentorVote).to.be.oneOf([null, 0, 1, 3]);
        expect(mentorMatch.companyVote).to.be.oneOf([null, 0, 1, 2]);
        expect(mentorMatch.mentorRanking).to.be.oneOf(range(1, 5, 1));
        expect(mentorMatch.companyRanking).to.be.oneOf(range(1, 5, 1));
      });
    });
  });
});
