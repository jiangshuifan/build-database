const { database, common } = require('../service/index')
const { getAllDatabase, createDatabase, isDBNameRepeat, updateDatabase, deleteDatabaseById, getDbById, getDatabaseByName } = database
const { getAllMarjorKeyAndForeignKeyByDBID, getAllTablesAndField } = common
const { createDatabaseFile } = require('../utils/create-db')
const { removeDbError, queryError, addDbError, dbNameRepeatError, dbNameRepeatUpdateError, updateDbError } = require('../errors/database.err')
const { formatReturn } = require('../utils/format')
class DatabaseHandler {
  getList = async (ctx) => {
    try {
      let dbs = await getAllDatabase()
      ctx.body = formatReturn(true, dbs)
    } catch (err) {
      console.log(err)
      ctx.app.emit('error', queryError, ctx)
    }
  }
  addDb = async (ctx) => {
    try {
      const db = ctx.request.body
      let isExist = await isDBNameRepeat(db)
      if (isExist !== false) {
        ctx.app.emit('error', dbNameRepeatError, ctx)
      } else {
        const res = await createDatabase(db)
        ctx.body = formatReturn(true, { id: res.id })
      }
    } catch (err) {
      ctx.app.emit('error', addDbError, ctx)
    }
  }
  updateDb = async (ctx) => {
    try {
      const db = ctx.request.body
      let isExist = await isDBNameRepeat(db)
      if (isExist !== false) {
        ctx.app.emit('error', dbNameRepeatUpdateError, ctx)
      } else {
        await updateDatabase(db.id, db)
        ctx.body = formatReturn(true)
      }
    } catch (err) {
      ctx.app.emit('error', updateDbError, ctx)
    }
  }
  removeDb = async (ctx) => {
    try {
      const db = ctx.request.body
      await deleteDatabaseById(db.id)
      ctx.body = formatReturn(true)
    } catch (error) {
      ctx.app.emit('error', removeDbError, ctx)
    }
  }
  getAllFieldRelation = async (ctx) => {
    try {
      const db = ctx.request.body
      const res = await getAllMarjorKeyAndForeignKeyByDBID(db.id)
      ctx.body = formatReturn(true, res)
    } catch (error) {
      console.log(error)
      ctx.app.emit('error', queryError, ctx)
    }
  }
  downloadDb = async (ctx) => {
    //思路，函数生成一个数据库表关系文件，再运行文件代码
    try {
      const db = ctx.request.body
      let database = await getDbById(db.id)
      let relation = await getAllMarjorKeyAndForeignKeyByDBID(db.id)
      let tables = await getAllTablesAndField(db.id)
      let dbFile = await createDatabaseFile({
        tables,
        relation,
        type: database.type
      })
      ctx.set('Content-Type', 'application/octet-stream')
      ctx.body = dbFile
    } catch (error) {
      console.log(error)
      ctx.app.emit('error', queryError, ctx)
    }
  }
  fuzzyQueryDb = async (ctx) => {
    try {
      let { keyword } = ctx.request.body
      let dbs = await getDatabaseByName(keyword)
      ctx.body = formatReturn(true, dbs)
    } catch (err) {
      console.log(err)
    }
  }
}
module.exports = new DatabaseHandler()