const Sequelize = require('sequelize');
const sequelize = require('../database/database');

const blocks = sequelize.define('blocks', {
  block_id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  block: {
    type: Sequelize.STRING(10),
    allowNull: false,
  },
});
module.exports = blocks;
