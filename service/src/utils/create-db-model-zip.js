const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize')

const render = require('json-templater/string');
let endOfLine = require('os').EOL;


//生成的数据库放这
let DB_Zip_PATH = path.resolve(__dirname, "../../database/zip/index.zip")
const output = fs.createWriteStream(DB_Zip_PATH);

//#region zip文件 生成、时间监听
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function () {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

output.on('end', function () {
  console.log('Data has been drained');
});

archive.on('warning', function (err) {
  if (err.code === 'ENOENT') {
    // log warning
  } else {
    // throw error
    throw err;
  }
});

archive.on('error', function (err) {
  throw err;
});
archive.pipe(output);
//#endregion

//#region 
//fileList:{fileName:'文件名',content:'内容字符串'}[]
const fileList = []

const FieldTemplate = `
  {{field}}:{
    type: DataTypes.{{fieldType}},
    allowNull: {{fieldAllowNull}},
    unique: {{fieldUnique}},
    comment: {{fieldName}}
  }
`
const TableTemplate = `
  const {{tableName}} = sequelize.define(
    {{tableUpperName}},
    {{fieldOptions}},
    {
      //设置表名.不设置默认会生成模型名称的复数，也可以通过const sequelize = new Sequelize('sqlite::memory:', { define: {freezeTableName: true}})关闭自动生成复数
      tableName: {{tableLowerName}},
      //设置不自动生成时间戳字段createdAt、updatedAt。也可以单独设置{createdAt:true,updatedAt:false}
      timestamps: false,
    }
  )
`
//#endregion



const createDatabaseFile = async (props) => {
  let { type, tables, relation } = props
  const seq = new Sequelize({
    dialect: type,
    storage: DB_STORE_PATH,
  })
  let models = []
  tables.forEach(tb => {
    let model = defineModel(seq, tb, type)
    models.push(model)
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