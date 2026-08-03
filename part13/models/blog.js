const { DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

const Blog = sequelize.define('blog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  author: { type: DataTypes.TEXT },
  url: { type: DataTypes.TEXT, allowNull: false },
  title: { type: DataTypes.TEXT, allowNull: false },
  likes: { type: DataTypes.INTEGER, defaultValue: 0 },
  userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
})

module.exports = Blog
