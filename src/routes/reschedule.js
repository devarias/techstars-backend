const { Router } = require('express');
const { createReschedule } = require('../controllers/reschedule.controller');
const router = Router();

//router.get("/", getSchedule);
router.post('/', createReschedule);

module.exports = router;
