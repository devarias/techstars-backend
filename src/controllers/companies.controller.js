const Company = require('../models/Companies');

/*export async function createCompany(req, res) {
  console.log(req.body);
  const data = req.body;
  if (data.Companies.length > 0) {
    data.Companies.forEach(async (row) => {
      const check = await Company.findOne({
        where: {
          company_name: row.company_name,
          email: row.email,
        },
      });
      if (check === null) {
        try {
          let newCompany = await Company.create(
            {
              company_name: row.company_name,
              email: row.email,
            },
            {
              fields: ['company_name', 'email'],
            }
          );
          if (newCompany) {
            res.json({
              meassage: 'Company Created Successfully',
              data: newCompany,
            });
          }
        } catch (error) {
          console.log(error);
          res.status(500).json({
            meassage: 'Something goes wrong !',
            data: {},
          });
        }
      }
    });
  }
}*/

async function getCompanies(req, res) {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (error) {
    console.log(error);
  }
}

async function getCompanyById(req, res) {
  const { id } = req.params;
  const company = await Company.findOne({
    where: {
      company_id: id,
    },
  });
  res.json(company);
}

async function deleteCompany(req, res) {
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
  } catch (error) {
    console.log(error);
  }
}
module.exports = { getCompanies, getCompanyById, deleteCompany, updateCompany };
