'use strict';
module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('Users', {
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {});

  const AssetType = sequelize.define('AssetTypes', {
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    attributeTypes: DataTypes.JSONB,
  }, {});

  const Asset = sequelize.define('Assets', {
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    AssetTypeId: DataTypes.INTEGER,
    assetAttributes: DataTypes.JSONB,
  }, {});

  const Allocation = sequelize.define('Allocations', {
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
    AssetId: {
      type: DataTypes.INTEGER,
    },
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    }
  }, {});

  Asset.belongsTo(AssetType);
  Allocation.belongsTo(User);
  Allocation.belongsTo(Asset);

  return {
    User,
    AssetType,
    Asset,
    Allocation,
  };
};
