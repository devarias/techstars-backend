const { Router } = require('express');
const {
  getCompanies,
  getCompanyById,
  deleteCompany,
  updateCompany,
} = require('../controllers/companies.controller');
const router = Router();
//Company data
//router.post("/", createCompany);
router.get('/', getCompanies);
//Company data by id
router.get('/:id', getCompanyById);
router.delete('/:id', deleteCompany);
router.put('/:id', updateCompany);

module.exports = router;
