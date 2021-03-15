const Sequelize = require('sequelize');
const sequelize = require('../database/database');
const Mentor_survey = require('./Mentor_survey');
const Company_survey = require('./Company_survey');

const mentors = sequelize.define(
  'mentors',
  {
    mentor_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    mentor: {
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
mentors.hasMany(Mentor_survey, {
  foreignKey: 'mentor_id',
  sourceKey: 'mentor_id',
});
mentors.hasMany(Company_survey, {
  foreignKey: 'mentor_id',
  sourceKey: 'mentor_id',
});
Mentor_survey.belongsTo(mentors, {
  foreignKey: 'mentor_id',
  sourceKey: 'mentor_id',
});
mentors.belongsTo(Company_survey, {
  foreignKey: 'mentor_id',
  sourceKey: 'mentor_id',
});

module.exports = mentors;
