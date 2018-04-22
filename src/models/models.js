const Sequelize = require('sequelize');
const createUserModel = require('./user');
const env       = process.env.NODE_ENV || 'development';
const config    = require('../../config/config.json')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const Models = {
  User: createUserModel(sequelize, Sequelize),
};

module.exports = Models;
