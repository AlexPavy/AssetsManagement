const Sequelize = require('sequelize');
const configurations = require('../../config/configurations');
const createModels = require('./model_definitions');

const config = configurations.getConfig('database');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const { User, Allocation, Asset, AssetType } = createModels(sequelize, Sequelize);

function resetAll() {
  return Promise.all([
    User.truncate(),
    Asset.truncate(),
    AssetType.truncate(),
    Allocation.truncate(),
  ]);
}

const Models = {
  User, Allocation, Asset, AssetType,
  resetAll,
};

module.exports = Models;
