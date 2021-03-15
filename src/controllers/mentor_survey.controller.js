const Mentor_survey = require('../models/Mentor_survey');

async function createMenSurvey(req, res) {
  try {
    const { mentor_id, company_id, vote, feedback, ranking } = req.body;
    const survey = await Mentor_survey.create(
      {
        mentor_id,
        company_id,
        vote,
        feedback,
        ranking,
      },
      {
        fields: ['mentor_id', 'company_id', 'vote', 'feedback', 'ranking'],
      }
    );
    res
      .status(201)
      .json({ message: 'New Mentor Survey Created', data: survey });
  } catch (e) {
    console.error(e);
  }
}
async function getMenSurvey(req, res) {
  try {
    const surveys = await Mentor_survey.findAll({
      attributes: [
        'survey_id',
        'vote',
        'mentor_id',
        'company_id',
        'vote',
        'feedback',
        'ranking',
      ],
    });
    res.status(200).json({ surveys });
  } catch (e) {
    console.error(e);
  }
}
async function deleteMenSurvey(req, res) {
  try {
    const { id } = req.params;
    const deleteCount = await Mentor_survey.destroy({
      where: {
        survey_id: id,
      },
    });
    res.status(200).json({
      message: 'Mentor Survey Deleted',
      count: deleteCount,
    });
  } catch (e) {
    console.error(e);
  }
}
async function updateMenSurvey(req, res) {
  try {
    const { id } = req.params;
    const { mentor_id, company_id, vote, feedback, ranking } = req.body;

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
      },
      {
        where: {
          survey_id: id,
        },
      }
    );
    res.status(200).json({
      message: 'Survey Updated Successfully',
      updatedSurvey,
      data: survey,
    });
  } catch (e) {
    console.error(e);
  }
}
async function getMenSurveyByMentor(req, res) {
  try {
    const { id } = req.params;
    const surveys = await Mentor_survey.findAll({
      attributes: ['mentor_id', 'company_id', 'vote', 'feedback', 'ranking'],
      where: {
        mentor_id: id,
      },
    });
    res.status(200).json({ surveys });
  } catch (e) {
    console.error(e);
  }
}
async function getMenSurveyById(req, res) {
  try {
    const { id } = req.params;
    const survey = await Mentor_survey.findOne({
      where: {
        survey_id: id,
      },
    });
    res.status(200).json({ survey });
  } catch (e) {
    console.error(e);
  }
}
module.exports = {
  createMenSurvey,
  getMenSurvey,
  deleteMenSurvey,
  updateMenSurvey,
  getMenSurveyByMentor,
  getMenSurveyById,
};
