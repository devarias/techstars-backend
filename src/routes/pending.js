const { Router } = require('express');
const { getPending } = require('../controllers/pending.controller');
const router = Router();

router.get('/', getPending);

module.exports = router;
