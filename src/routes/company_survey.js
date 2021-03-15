const { Router } = require('express');
const {
  createComSurvey,
  getComSurvey,
  getComSurveyById,
  deleteComSurvey,
  updateComSurvey,
  getComSurveyByMentor,
} = require('../controllers/company_survey.controller');
const router = Router();

//Mentors survey data
router.post('/', createComSurvey);
router.get('/', getComSurvey);
//Mentor survey data by id
router.get('/:id', getComSurveyById);
router.delete('/:id', deleteComSurvey);
router.put('/:id', updateComSurvey);
//mentor survey data by mentor
router.get('/mentor/:id', getComSurveyByMentor);

module.exports = router;
