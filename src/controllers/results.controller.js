const axios = require('axios');

const mentorsApi = 'https://techstars-api.herokuapp.com/api/mentors';
const companiesApi = 'https://techstars-api.herokuapp.com/api/companies';
const mentorSurveyApi = 'https://techstars-api.herokuapp.com/api/mentor_survey';
const companySurveyApi =
  'https://techstars-api.herokuapp.com/api/company_survey';
const blocksApi = 'https://techstars-api.herokuapp.com/api/meetings';

const info = {
  mentors: null,
  companies: null,
  mentorSurveys: null,
  companySurveys: null,
  blocks: null,
};

async function getMentors() {
  await axios
    .get(mentorsApi)
    .then((res) => {
      info.mentors = res.data;
    })
    .catch((err) => {
      console.error(err);
    });
}
async function getMentorSurveys() {
  await axios
    .get(mentorSurveyApi)
    .then((res) => {
      info.mentorSurveys = res.data;
    })
    .catch((err) => {
      console.error(err);
    });
}
async function getCompanies() {
  await axios
    .get(companiesApi)
    .then((res) => {
      info.companies = res.data;
    })
    .catch((err) => {
      console.error(err);
    });
}
async function getCompanySurveys() {
  await axios
    .get(companySurveyApi)
    .then((res) => {
      info.companySurveys = res.data;
    })
    .catch((err) => {
      console.error(err);
    });
}
async function getBlocks() {
  await axios
    .get(blocksApi)
    .then((res) => {
      info.blocks = res.data;
    })
    .catch((err) => {
      console.error(err);
    });
}
async function getInfo() {
  try {
    await getBlocks();
    await getMentors();
    await getCompanies();
    await getMentorSurveys();
    await getCompanySurveys();
  } catch (e) {
    console.error(e);
  }
}
function meetingHappened(meetingSlot) {
  const meetingDay = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
  };
  const days = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
  };
  let date = Date();
  if (meetingDay[meetingSlot.day] < days[date.slice(0, 3)]) {
    return true;
  }
  if (meetingDay[meetingSlot.day] === days[date.slice(0, 3)]) {
    if (
      parseInt(meetingSlot.slot.substring(0, 2)) <
      parseInt(date.split(' ')[4].substring(0, 2))
    ) {
      return true;
    }
  }
  return false;
}
function meetingDone(meeting) {
  if (meeting.day && meeting.block && meeting.slot) {
    if (meetingHappened(meeting)) {
      return true;
    }
  }
  return false;
}
async function createMentorResults(
  mentors,
  companies,
  mentorSurveys,
  companySurveys,
  blocks,
  results
) {
  try {
    let list = {};
    let subList = [];
    let mentorList = [];
    for (let i = 0; i < blocks.length; i++) {
      let infoBlocks = {
        company: blocks[i].company,
        mentorVote: NaN,
        companyVote: NaN,
        mentorRanking: 1,
        companyRanking: 1,
        mentorFeedback: null,
        companyFeedback: null,
        matchResult: NaN,
        meetingDone: meetingDone(blocks[i]),
      };
      if (!list[blocks[i].mentor]) {
        subList = [];
        list[blocks[i].mentor] = subList;
        subList.push(infoBlocks);
      } else {
        subList = list[blocks[i].mentor];
        subList.push(infoBlocks);
      }
      if (!mentorList.includes(blocks[i].mentor)) {
        mentorList.push(blocks[i].mentor);
      }
    }
    for (let i = 0; i < mentorList.length; i++) {
      let mentorID;
      let companyID;
      for (let j = 0; j < list[mentorList[i]].length; j++) {
        for (let k = 0; k < mentors.length; k++) {
          if (mentors[k].mentor === mentorList[i]) {
            mentorID = mentors[k].mentor_id;
            break;
          }
        }
        for (let k = 0; k < companies.length; k++) {
          if (companies[k].company === list[mentorList[i]][j].company) {
            companyID = companies[k].company_id;
            break;
          }
        }
        for (let k = 0; k < mentorSurveys.surveys.length; k++) {
          if (
            mentorID === mentorSurveys.surveys[k].mentor_id &&
            companyID === mentorSurveys.surveys[k].company_id
          ) {
            list[mentorList[i]][j].mentorVote = mentorSurveys.surveys[k].vote;
            list[mentorList[i]][j].mentorRanking =
              mentorSurveys.surveys[k].ranking;
            list[mentorList[i]][j].mentorFeedback =
              mentorSurveys.surveys[k].feedback;
            break;
          }
        }
        for (let k = 0; k < companySurveys.surveys.length; k++) {
          if (
            companyID === companySurveys.surveys[k].company_id &&
            mentorID === companySurveys.surveys[k].mentor_id
          ) {
            list[mentorList[i]][j].companyVote = companySurveys.surveys[k].vote;
            list[mentorList[i]][j].companyRanking =
              companySurveys.surveys[k].ranking;
            list[mentorList[i]][j].companyFeedback =
              companySurveys.surveys[k].feedback;
            break;
          }
        }
        if (
          list[mentorList[i]][j].mentorVote !== NaN &&
          list[mentorList[i]][j].companyVote !== NaN
        ) {
          list[mentorList[i]][j].matchResult =
            list[mentorList[i]][j].mentorVote *
            list[mentorList[i]][j].companyVote;
        }
      }
    }
    results.push(list);
  } catch (e) {
    console.error(e);
  }
}
async function giveMentorResults(req, res) {
  let results = [];
  await getInfo();
  await createMentorResults(
    info.mentors,
    info.companies,
    info.mentorSurveys,
    info.companySurveys,
    info.blocks,
    results
  );
  res.json(results);
}
async function createCompanyResults(
  mentors,
  companies,
  mentorSurveys,
  companySurveys,
  blocks,
  results
) {
  try {
    let list = {};
    let subList = [];
    let companyList = [];
    for (let i = 0; i < blocks.length; i++) {
      let infoBlocks = {
        mentor: blocks[i].mentor,
        mentorVote: NaN,
        companyVote: NaN,
        mentorRanking: 1,
        companyRanking: 1,
        mentorFeedback: null,
        companyFeedback: null,
        matchResult: NaN,
        meetingDone: meetingDone(blocks[i]),
      };
      if (!list[blocks[i].company]) {
        subList = [];
        list[blocks[i].company] = subList;
        subList.push(infoBlocks);
      } else {
        subList = list[blocks[i].company];
        subList.push(infoBlocks);
      }
      if (!companyList.includes(blocks[i].company)) {
        companyList.push(blocks[i].company);
      }
    }
    for (let i = 0; i < companyList.length; i++) {
      let mentorID;
      let companyID;
      for (let j = 0; j < list[companyList[i]].length; j++) {
        for (let k = 0; k < companies.length; k++) {
          if (companies[k].company === companyList[i]) {
            companyID = companies[k].company_id;
            break;
          }
        }
        for (let k = 0; k < mentors.length; k++) {
          if (mentors[k].mentor === list[companyList[i]][j].mentor) {
            mentorID = mentors[k].mentor_id;
            break;
          }
        }
        for (let k = 0; k < mentorSurveys.surveys.length; k++) {
          if (
            mentorID === mentorSurveys.surveys[k].mentor_id &&
            companyID === mentorSurveys.surveys[k].company_id
          ) {
            list[companyList[i]][j].mentorVote = mentorSurveys.surveys[k].vote;
            list[companyList[i]][j].mentorRanking =
              mentorSurveys.surveys[k].ranking;
            list[companyList[i]][j].mentorFeedback =
              mentorSurveys.surveys[k].feedback;
            break;
          }
        }
        for (let k = 0; k < companySurveys.surveys.length; k++) {
          if (
            companyID === companySurveys.surveys[k].company_id &&
            mentorID === companySurveys.surveys[k].mentor_id
          ) {
            list[companyList[i]][j].companyVote =
              companySurveys.surveys[k].vote;
            list[companyList[i]][j].companyRanking =
              companySurveys.surveys[k].ranking;
            list[companyList[i]][j].companyFeedback =
              companySurveys.surveys[k].feedback;
            break;
          }
        }
        if (
          list[companyList[i]][j].mentorVote !== NaN &&
          list[companyList[i]][j].companyVote !== NaN
        ) {
          list[companyList[i]][j].matchResult =
            list[companyList[i]][j].mentorVote *
            list[companyList[i]][j].companyVote;
        }
      }
    }
    results.push(list);
  } catch (e) {
    console.error(e);
  }
}
async function giveCompanyResults(req, res) {
  let results = [];
  await getInfo();
  await createCompanyResults(
    info.mentors,
    info.companies,
    info.mentorSurveys,
    info.companySurveys,
    info.blocks,
    results
  );
  res.json(results);
}
module.exports = { giveMentorResults, giveCompanyResults };
