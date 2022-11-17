const Sequelize = require('sequelize');

//config.json
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const User = require('./user');
const Key = require('./key');

//db create from config.json
const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

//sequelize 
db.sequelize = sequelize;

db.User = User;
db.Key = Key;

User.init(sequelize);
Key.init(sequelize);

//associate db
// User.associate(db);
// Key.associate(db);

module.exports = db;