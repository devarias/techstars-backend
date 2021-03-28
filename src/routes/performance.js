const { Router } = require('express');
const {
  performanceMentors,
  performanceCompanies,
} = require('../controllers/performance.controller');
const router = Router();

router.get('/mentors', performanceMentors);
router.get('/companies', performanceCompanies);

module.exports = router;
