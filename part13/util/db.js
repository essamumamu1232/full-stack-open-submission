const { Sequelize } = require('sequelize')
require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/blogapp'

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: { ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false },
  logging: false,
})

module.exports = { sequelize }
