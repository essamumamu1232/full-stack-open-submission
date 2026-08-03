const { DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  passwordHash: { type: DataTypes.STRING },
  disabled: { type: DataTypes.BOOLEAN, defaultValue: false },
})

module.exports = User
