const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'dbt3gie7ucbio0',
  'ozyzmwnbqlktme',
  'a2bf6dc5eeefb001457d353c87c48dba3747be223ba65baa125a2e943e2428a9',
  {
    host: 'ec2-54-164-22-242.compute-1.amazonaws.com',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // <<<<<<< THIS
      },
    },
    pool: {
      max: 20,
      min: 0,
      require: 30000,
      idle: 10000,
    },
    logging: false,
    define: {
      freezeTableName: true,
      timestamps: false,
    },
  }
);

module.exports = sequelize;
