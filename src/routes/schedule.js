const { Router } = require('express');
const {
  getSchedule,
  createSchedule,
} = require('../controllers/schedule.controller');
const router = Router();

router.get('/', getSchedule);
router.post('/', createSchedule);

module.exports = router;
