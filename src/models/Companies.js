const Sequelize = require('sequelize');
const sequelize = require('../database/database');
const Company_survey = require('./Company_survey');
const Mentor_survey = require('./Mentor_survey');
//Data Acces Object design pattern
const companies = sequelize.define(
  'companies',
  {
    company_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    company: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    email: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);
companies.hasMany(Company_survey, {
  foreignKey: 'company_id',
  sourceKey: 'company_id',
});
companies.hasMany(Mentor_survey, {
  foreignKey: 'company_id',
  sourceKey: 'company_id',
});
Company_survey.belongsTo(companies, {
  foreignKey: 'company_id',
  sourceKey: 'company_id',
});
companies.belongsTo(Mentor_survey, {
  foreignKey: 'company_id',
  sourceKey: 'company_id',
});
module.exports = companies;
