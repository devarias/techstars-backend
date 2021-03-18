const Sequelize = require('sequelize');
const sequelize = require('../database/database');
const mentors = require('./Mentors');
const companies = require('./Companies');
const days = require('./Days');
const blocks = require('./Blocks');
const slots = require('./Slots');

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
schedule.belongsTo(mentors, {
  as: 'mentors',
  foreignKey: 'mentor_id',
  onDelete: 'CASCADE',
});

schedule.belongsTo(days, {
  as: 'days',
  foreignKey: 'day_id',
  onDelete: 'CASCADE',
});

schedule.belongsTo(companies, {
  as: 'companies',
  foreignKey: { name: 'company_id' },
  onDelete: 'CASCADE',
});

schedule.belongsTo(blocks, {
  as: 'blocks',
  foreignKey: 'block_id',
  onDelete: 'CASCADE',
});

schedule.belongsTo(slots, {
  as: 'slots',
  foreignKey: 'slot_id',
  onDelete: 'CASCADE',
});

module.exports = schedule;
