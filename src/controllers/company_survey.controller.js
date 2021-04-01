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
      },
      {
        fields: ['mentor_id', 'company_id', 'vote', 'feedback', 'ranking'],
      }
    );
    res
      .status(201)
      .json({ message: 'New Company Survey Created', data: survey });
  } catch (error) {
    console.log(error);
  }
}
async function getComSurvey(req, res) {
  try {
    const surveys = await Company_survey.findAll({
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
async function deleteComSurvey(req, res) {
  try {
    const { id } = req.params;
    const deleteCount = await Company_survey.destroy({
      where: {
        survey_id: id,
      },
    });
    res.status(200).json({
      message: 'Company Survey Deleted ',
      count: deleteCount,
    });
  } catch (e) {
    console.error(e);
  }
}
async function updateComSurvey(req, res) {
  try {
    const { id } = req.params;
    const { mentor_id, company_id, vote, feedback, ranking } = req.body;

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
async function getComSurveyByMentor(req, res) {
  try {
    const { id } = req.params;
    const surveys = await Company_survey.findAll({
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
async function getComSurveyById(req, res) {
  try {
    const { id } = req.params;
    const survey = await Company_survey.findOne({
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
  createComSurvey,
  getComSurvey,
  deleteComSurvey,
  updateComSurvey,
  getComSurveyByMentor,
  getComSurveyById,
};
