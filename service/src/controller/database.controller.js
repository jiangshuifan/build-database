const { getAllDatabase, createDatabase } = require('../service/index')
class DatabaseHandler {
  handleGetDatabaseList = async (ctx) => {
    let dbs = await getAllDatabase()
    ctx.body = dbs
  }
  handleAddNewDatabase = async (ctx) => {
    const db = ctx.request.body
    console.log(db)
    let dbs = await createDatabase(db)
    ctx.body = dbs
  }
}
module.exports = new DatabaseHandler()