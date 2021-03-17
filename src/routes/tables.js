const { Router } = require('express');
const { getTable } = require('../controllers/table.controller');
const router = Router();

router.get('/', getTable);

module.exports = router;
