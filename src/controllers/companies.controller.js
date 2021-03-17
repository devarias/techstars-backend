const Company = require('../models/Companies');

async function getCompanies(req, res) {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (error) {
    console.log(error);
  }
}

async function getCompanyById(req, res) {
  try {
    const { id } = req.params;
    const company = await Company.findOne({
      where: {
        company_id: id,
      },
    });
    res.json(company);
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Company not found' });
  }
}

async function deleteCompany(req, res) {
  try {
    const { id } = req.params;
    const deleteRowCount = Company.destroy({
      where: {
        company_id: id,
      },
    });
    res.json({
      message: 'Company Deleted Successfully',
      count: deleteRowCount,
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Company not found' });
  }
}

async function updateCompany(req, res) {
  try {
    const { id } = req.params;
    const { company_name, email } = req.body;
    const companies = await Company.findAll({
      attributes: ['company_id', 'company_name', 'email'],
      where: {
        company_id: id,
      },
    });
    if (companies.length > 0) {
      companies.forEach(async (company) => {
        await company.update({
          company_name: company_name,
          email: email,
        });
      });
    }
    return res.json({
      message: 'Company Updated Successfully',
      data: companies,
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({ message: 'Company not found' });
  }
}
module.exports = { getCompanies, getCompanyById, deleteCompany, updateCompany };
