const Sequelize = require('sequelize');
const sequelize = require('../database/database');

const days = sequelize.define('days', {
  day_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  day: {
    type: Sequelize.STRING(10),
    allowNull: false,
  },
});

module.exports = days;
