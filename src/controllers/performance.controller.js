const axios = require('axios');

const mentorsApi = 'https://techstars-api.herokuapp.com/api/mentors';
const companiesApi = 'https://techstars-api.herokuapp.com/api/companies';
const resultsMentorsApi =
  'https://techstars-api.herokuapp.com/api/results/mentors';
const resultsCompaniesApi =
  'https://techstars-api.herokuapp.com/api/results/companies';
const percentage = 100;

async function performanceMentors(req, res) {
  const mentors = await axios
    .get(mentorsApi)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
    });
  const results = await axios.get(resultsMentorsApi).then((response) => {
    return response.data[0];
  });
  const mentorsPerformance = {};
  for (let i = 0; i < mentors.length; i++) {
    const mentorName = mentors[i].mentor;
    const performance = {
      wants: 0,
      willing: 0,
      wont: 0,
      totalVotes: 0,
      performance: 0,
    };
    for (let j = 0; j < results[mentorName].length; j++) {
      if (results[mentorName][j].companyVote === 2) {
        performance.wants++;
      }
      if (results[mentorName][j].companyVote === 1) {
        performance.willing++;
      }
      if (results[mentorName][j].companyVote === 0) {
        performance.wont++;
      }
    }
    performance.totalVotes =
      performance.wants + performance.willing + performance.wont;
    performance.performance = parseInt(
      ((performance.wants + performance.willing) * percentage) /
        performance.totalVotes
    );
    mentorsPerformance[mentorName] = performance;
  }
  res.json(mentorsPerformance);
}
async function performanceCompanies(req, res) {
  const companies = await axios
    .get(companiesApi)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
    });
  const results = await axios.get(resultsCompaniesApi).then((response) => {
    return response.data[0];
  });
  const companiesPerformance = {};
  for (let i = 0; i < companies.length; i++) {
    const companyName = companies[i].company;
    const performance = {
      wants: 0,
      willing: 0,
      wont: 0,
      totalVotes: 0,
      performance: 0,
    };
    console.log(results);
    for (let j = 0; j < results[companyName].length; j++) {
      if (results[companyName][j].mentorVote === 3) {
        performance.wants++;
      }
      if (results[companyName][j].mentorVote === 1) {
        performance.willing++;
      }
      if (results[companyName][j].mentorVote === 0) {
        performance.wont++;
      }
    }
    performance.totalVotes =
      performance.wants + performance.willing + performance.wont;
    performance.performance = parseInt(
      ((performance.wants + performance.willing) * percentage) /
        performance.totalVotes
    );
    companiesPerformance[companyName] = performance;
  }
  res.json(companiesPerformance);
}
module.exports = { performanceMentors, performanceCompanies };
