const Company_survey = require('../models/Company_survey');

async function createComSurvey(req, res) {
  try {
    const { mentor_id, company_id, vote, feedback, ranking } = req.body;
    const survey = await Company_survey.create(
      {
        mentor_id,
        company_id,
        vote,
        feedback,
        ranking,
        //preference,
      },
      {
        fields: ['mentor_id', 'company_id', 'vote', 'feedback', 'ranking'],
      }
    );
    res.json({ message: 'New Company Survey Created' });
  } catch (error) {
    console.log(error);
  }
}

async function getComSurvey(req, res) {
  const surveys = await Company_survey.findAll({
    attributes: [
      'survey_id',
      'vote',
      'mentor_id',
      'company_id',
      'vote',
      'feedback',
      'ranking',
      //'preference',
    ],
  });
  res.json({ surveys });
}

async function deleteComSurvey(req, res) {
  const { id } = req.params;
  const deleteCount = await Company_survey.destroy({
    where: {
      survey_id: id,
    },
  });
  res.json({
    message: 'Company Survey Deleted ',
    count: deleteCount,
  });
}

async function updateComSurvey(req, res) {
  const { id } = req.params;
  const { mentor_id, company_id, vote, feedback } = req.body;

  const survey = await Company_survey.findAll({
    attributes: ['mentor_id', 'company_id', 'vote', 'feedback', 'ranking'],
    where: {
      survey_id: id,
    },
  });
  const updatedSurvey = await Company_survey.update(
    {
      mentor_id,
      company_id,
      vote,
      feedback,
      ranking,
      //preference,
    },
    {
      where: {
        survey_id: id,
      },
    }
  );
  res.json({
    message: 'Survey Updated Successfully',
    updatedSurvey,
  });
}
async function getComSurveyByMentor(req, res) {
  const { id } = req.params;
  const surveys = await Company_survey.findAll({
    attributes: ['mentor_id', 'company_id', 'vote', 'feedback', 'ranking'],
    where: {
      mentor_id: id,
    },
  });
  res.json({ surveys });
}

async function getComSurveyById(req, res) {
  const { id } = req.params;
  const survey = await Company_survey.findOne({
    where: {
      survey_id: id,
    },
  });
  res.json({ survey });
}
module.exports = {
  createComSurvey,
  getComSurvey,
  deleteComSurvey,
  updateComSurvey,
  getComSurveyByMentor,
  getComSurveyById,
};
