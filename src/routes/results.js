const { Router } = require('express');
const {
  giveMentorResults,
  giveCompanyResults,
} = require('../controllers/results.controller');
const router = Router();

router.get('/mentors', giveMentorResults);
router.get('/companies', giveCompanyResults);

module.exports = router;
