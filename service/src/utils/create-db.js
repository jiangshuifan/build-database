const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize')
//生成的数据库放这
let DB_STORE_PATH = path.resolve(__dirname, "../../database/data/index.db")

const createDatabaseFile = async (props) => {
  let { type, tables, relation } = props
  const seq = new Sequelize({
    dialect: type,
    storage: DB_STORE_PATH,
  })
  let models = []
  let tbs = {}
  tables.forEach(tb => {
    let model = defineModel(seq, tb, type)
    tbs[tb.id] = model
    models.push(model)
  })
  relation.forEach(r => {
    tbs[r.marjorKeyTable].hasMany(tbs[r.foreignKeyTable], {
      onDelete: 'CASCADE',
      foreignKey: {
        type: DataTypes[type][r.foreignKeyType],
        name: r.foreignKeyName,
      },
      sourceKey: r.marjorKeyName,
    })
    tbs[r.foreignKeyTable].belongsTo(tbs[r.marjorKeyTable], {
      onDelete: 'CASCADE',
      foreignKey: {
        type: DataTypes[type][r.foreignKeyType],
        name: r.foreignKeyName
      },
      targetKey: r.marjorKeyName,
    });
  })
  for (let tableName in models) {
    await models[tableName].sync({ force: true })
  }
  let file = await fs.readFileSync(DB_STORE_PATH)
  return file
}


function defineModel(seq, table, type) {
  let option = defineField(table.children, type)
  console.log(option)
  let Table = seq.define(
    table.name.toLocaleUpperCase(),
    option,
    {
      //设置表名.不设置默认会生成模型名称的复数，也可以通过const sequelize = new Sequelize('sqlite::memory:', { define: {freezeTableName: true}})关闭自动生成复数
      tableName: table.name.toLocaleLowerCase(),
      //设置不自动生成时间戳字段createdAt、updatedAt。也可以单独设置{createdAt:true,updatedAt:false}
      timestamps: false,
    })
  return Table
}


function defineField(fieldsList, type) {
  let target = {}
  fieldsList.forEach(field => {
    if (field.field !== 'id') {
      target[field.field] = {
        type: DataTypes[type][field.type],
        allowNull: field.allowNull,
        unique: field.unique,
        comment: field.name
      }
    }

  })
  return target
}


module.exports = {
  createDatabaseFile
}