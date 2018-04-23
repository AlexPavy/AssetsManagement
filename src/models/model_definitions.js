'use strict';
module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
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

  const AssetType = sequelize.define('AssetType', {
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    attributeTypes: DataTypes.JSONB,
  }, {});

  const Asset = sequelize.define('Asset', {
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    assetTypeId: {
      type: DataTypes.INTEGER,
    },
    attributes: DataTypes.JSONB,
  }, {});

  const Allocation = sequelize.define('Allocation', {
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.DATE,
    },
    startDate: {
      type: DataTypes.DATE,
    },
    endDate: {
      type: DataTypes.DATE,
    }
  }, {});

  Asset.hasOne(AssetType);
  Allocation.belongsTo(User);
  Allocation.hasOne(Asset);

  return {
    User,
    AssetType,
    Asset,
    Allocation,
  };
};
