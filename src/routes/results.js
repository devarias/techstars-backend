const { Router } = require('express');
const { giveResults } = require('../controllers/results.controller');
const router = Router();

router.get('/', giveResults);

module.exports = router;
