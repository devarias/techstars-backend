const Mentor_survey = require('../models/Mentor_survey');

async function createMenSurvey(req, res) {
  const { mentor_id, company_id, vote, feedback, ranking } = req.body;
  const survey = await Mentor_survey.create(
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
  res.json({ message: 'New Mentor Survey Created', data: survey });
}

async function getMenSurvey(req, res) {
  const surveys = await Mentor_survey.findAll({
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

async function deleteMenSurvey(req, res) {
  const { id } = req.params;
  const deleteCount = await Mentor_survey.destroy({
    where: {
      survey_id: id,
    },
  });
  res.json({
    message: 'Mentor Survey Deleted',
    count: deleteCount,
  });
}

async function updateMenSurvey(req, res) {
  const { id } = req.params;
  const { mentor_id, company_id, vote, feedback } = req.body;

  const survey = await Mentor_survey.findAll({
    attributes: ['mentor_id', 'company_id', 'vote', 'feedback', 'ranking'],
    where: {
      survey_id: id,
    },
  });
  const updatedSurvey = await Mentor_survey.update(
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
async function getMenSurveyByMentor(req, res) {
  const { id } = req.params;
  const surveys = await Mentor_survey.findAll({
    attributes: ['mentor_id', 'company_id', 'vote', 'feedback', 'ranking'],
    where: {
      mentor_id: id,
    },
  });
  res.json({ surveys });
}

async function getMenSurveyById(req, res) {
  const { id } = req.params;
  const survey = await Mentor_survey.findOne({
    where: {
      survey_id: id,
    },
  });
  res.json({ survey });
}
module.exports = {
  createMenSurvey,
  getMenSurvey,
  deleteMenSurvey,
  updateMenSurvey,
  getMenSurveyByMentor,
  getMenSurveyById,
};
