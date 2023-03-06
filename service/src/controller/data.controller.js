const { data } = require('../service/index')
const { getAllDatabase, createDatabase } = data
const { formatReturn } = require('../utils/format')

class DataHandler {
  getList = async (ctx) => {
    let dbs = await getAllDatabase()
    ctx.body = dbs
  }
  addDb = async (ctx) => {
    const db = ctx.request.body
    let dbs = await createDatabase(db)
    ctx.body = dbs
  }
}
module.exports = new DataHandler()