const Sequelize = require('sequelize');
const createUserModel = require('./user');
const configurations = require('../../config/configurations');

const config = configurations.getConfig('database');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const User = createUserModel(sequelize, Sequelize);

function resetAll() {
  return User.truncate();
}

const Models = {
  User,
  resetAll,
};

module.exports = Models;
