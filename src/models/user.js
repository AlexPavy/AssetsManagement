'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
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
  return User;
};
