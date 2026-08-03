const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
require('dotenv').config()

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:password@localhost:5432/blogapp'

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production'
      ? { require: true, rejectUnauthorized: false }
      : false,
  },
  logging: false,
})

const migrationConf = {
  migrations: { glob: 'migrations/*.js' },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations run:', migrations.map(m => m.name))
}

const rollbackMigration = async () => {
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

module.exports = { sequelize, runMigrations, rollbackMigration }
