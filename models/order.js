const {DataTypes} = require('sequelize');

const sequelize = require("../util/database");

const Order = sequelize.define("order",{
  id:{
    type : DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  }
})

module.exports = Order;