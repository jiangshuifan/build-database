const { DB_Path } = require("../config")
const { Sequelize } = require('sequelize')

// const seq = new Sequelize('sqlite:' + '../../db/apistore.db')
const seq = new Sequelize({
  dialect: 'sqlite',
  storage: DB_Path,
})

module.exports = seq