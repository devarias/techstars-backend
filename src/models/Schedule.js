const Sequelize = require('sequelize');
const sequelize = require('../database/database');

const schedule = sequelize.define(
  'schedule',
  {
    meet_id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    mentor_id: {
      type: Sequelize.UUID,
    },
    day_id: {
      type: Sequelize.UUID,
    },
    block_id: {
      type: Sequelize.UUID,
    },
    company_id: {
      type: Sequelize.UUID,
    },
    slot_id: {
      type: Sequelize.UUID,
    },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = schedule;
