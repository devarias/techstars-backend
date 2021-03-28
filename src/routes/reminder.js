const { Router } = require('express');
const {
  sendReminderMentors,
  sendReminderCompanies,
} = require('../controllers/reminder.controller');
const router = Router();

router.get('/mentors', sendReminderMentors);
router.get('/companies', sendReminderCompanies);

module.exports = router;
