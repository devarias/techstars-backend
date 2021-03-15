const Sequelize = require('sequelize');
const sequelize = require('../database/database');

const slots = sequelize.define('slots', {
  slot_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  slot: {
    type: Sequelize.TIME(0),
    allowNull: false,
  },
});

module.exports = slots;
