const path = require('path');

let tableInitFilePath = path.join(__dirname, "../src/model/index.js")

const tabelInitData = require(tableInitFilePath)

for (let tableName in tabelInitData) {
  tabelInitData[tableName].sync({ force: true })
}