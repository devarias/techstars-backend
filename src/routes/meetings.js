const { Router } = require('express');
const {
  getMeetings,
  cancelMeetings,
} = require('../controllers/meetings.controller');
const router = Router();

router.get('/', getMeetings);
router.put('/', cancelMeetings);

module.exports = router;
