const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('node-complete', "root", "8008580085", {
    dialect: "mysql",
    hostL: "localhost",
    
});


module.exports = sequelize;