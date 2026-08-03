// Exercise 13.21: add session/token invalidation table
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      token: { type: DataTypes.TEXT, allowNull: false, unique: true },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      created_at: { type: DataTypes.DATE, allowNull: false },
      updated_at: { type: DataTypes.DATE, allowNull: false },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions')
  },
}
