const sequelizePackage = require('sequelize');
const allConfig = require('../config/config')

const initUserModel = require('./userModel')
const initGameModel = require('./gameModel')

const { Sequelize } = sequelizePackage;
const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};

const sequelize = new Sequelize(
  config.database, 
  config.username, 
  config.password, 
  config
);

db.Game = initGameModel(sequelize, Sequelize.DataTypes);
db.User = initUserModel(sequelize, Sequelize.DataTypes);

db.Game.belongsToMany(db.User, { through: 'games_users'});
db.User.belongsToMany(db.Game, { through: 'games_users'});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db