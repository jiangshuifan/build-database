const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const camelCase = require('camelcase')
const render = require('json-templater/string');
let endOfLine = require('os').EOL;

//生成的数据库放这
let DB_Zip_PATH = path.resolve(__dirname, "../../database/zip/index.zip")

//#endregion

//#region  模板
//数据库实例文件模板
const instanceTemplate = `
  const { Sequelize } = require('sequelize')
  const seq = new Sequelize({
    dialect: '{{type}}',
    storage: '数据库路径',
  })
  module.exports = seq
`
//字段模板
const FieldTemplate = `
  '{{field}}':{
    type: {{fieldType}},
    allowNull: {{fieldAllowNull}},
    unique: {{fieldUnique}},
    comment: '{{comment}}'
  }
`
//数据库表模板
const TableTemplate = `
  const seq = require('./instance.js')
  const { DataTypes } = require('sequelize'); 
  const {{tableUpperName}} = seq.define(
    '{{tableUpperName}}',
    {{fieldOptions}},
    {
      tableName: '{{tableLowerName}}',
      timestamps: false,
    }
  )
  module.exports = {{tableUpperName}}
`
//index.js模板
const MergeTemplate = `
  {{require}}
  const { DataTypes } = require('sequelize');

  {{hasMany}}

  {{belongTo}}

 module.exports={{{export}}}
`


//#endregion




const createDatabaseModelZip = async (props) => {
  console.log(props)
  //fileList:{fileName:'文件名',content:'内容字符串'}[]
  const fileList = []
  //index.js
  const requireList = []
  const belongToList = []
  const hasManyList = []
  const exportList = []
  let { type, tables, relation, resolve, reject } = props
  //instance.js
  fileList.push({
    fileName: 'instance.js',
    content: render(instanceTemplate, {
      type: type,
    })
  })

  //table.model.js
  tables.forEach(tb => {
    let propertiesList = []
    let upperName = camelCase(tb.name, { pascalCase: true })
    requireList.push(`const ${upperName} = require('./${upperName}.model');`)
    exportList.push(upperName)
    tb.children.forEach(fd => {
      if (fd.field !== 'id') {
        propertiesList.push(render(FieldTemplate, {
          field: fd.field,
          fieldType: fd.type ? 'DataTypes.' + fd.type : undefined,
          fieldAllowNull: fd.allowNull,
          fieldUnique: fd.unique,
          comment: fd.name
        }))
      }
    })
    fileList.push({
      fileName: `${upperName}.model.js`,
      content: render(TableTemplate, {
        tableUpperName: camelCase(tb.name, { pascalCase: true }),
        fieldOptions: `{${propertiesList.join(',', endOfLine)}}`,
        tableLowerName: tb.name.toLocaleLowerCase()
      })
    })


  })
  relation.forEach(r => {
    let upperForeignKeyTableName = camelCase(r.foreignKeyTableName, { pascalCase: true })
    let upperMarjorKeyTableName = camelCase(r.marjorKeyTableName, { pascalCase: true })
    belongToList.push(
      `${upperForeignKeyTableName}.belongsTo(${upperMarjorKeyTableName}, {
        onDelete: 'CASCADE',
        foreignKey: {
          type: ${r.foreignKeyType ? 'DataTypes.' + r.foreignKeyType : undefined},
          name: '${r.foreignKeyName}'
        },
        targetKey: '${r.marjorKeyName}',
      });`
    )
    hasManyList.push(
      `${upperMarjorKeyTableName}.hasMany(${upperForeignKeyTableName}, {
        onDelete: 'CASCADE',
        foreignKey: {
          type: ${r.foreignKeyType ? 'DataTypes.' + r.foreignKeyType : undefined},
          name: '${r.foreignKeyName}',
        },
        sourceKey: '${r.marjorKeyName}',
      });`
    )
  })
  //index.js
  fileList.push({
    fileName: 'index.js',
    content: render(MergeTemplate, {
      require: requireList.join(endOfLine),
      hasMany: hasManyList.join(endOfLine),
      belongTo: belongToList.join(endOfLine),
      export: exportList.join(',')
    })
  })

  createZip(fileList, DB_Zip_PATH, resolve, reject)
}

const createZip = async (fileList, path, resolve, reject) => {
  try {
    const output = fs.createWriteStream(path);
    //#region zip文件 生成、时间监听
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });
    output.on('close', () => {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');

      fs.readFile(path, (err, data) => {
        if (err) {
          reject('err')
        } else {
          resolve(data)
        }
      })
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
    }
    );

    archive.on('error', function (err) {
      throw err;
    });
    console.log(output)
    archive.pipe(output);
    fileList.forEach(file => {
      let { fileName, content } = file
      archive.append(content, { name: fileName })
    })
    archive.finalize();
  } catch (err) {
    reject('err')
    console.log(err)
  }
}
module.exports = {
  createDatabaseModelZip
}