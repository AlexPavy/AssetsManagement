const Sequelize = require('sequelize');
const configurations = require('../../config/configurations');
const createModels = require('./model_definitions');

const config = configurations.getConfig('database');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const {User, Allocation, Asset, AssetType} = createModels(sequelize, Sequelize);

async function resetAll() {
  await Allocation.destroy({truncate: true, cascade: true});
  await User.destroy({truncate: true, cascade: true});
  await Asset.destroy({truncate: true, cascade: true});
  await AssetType.destroy({truncate: true, cascade: true});
}

const Models = {
  User, Allocation, Asset, AssetType,
  resetAll,
};

module.exports = Models;
