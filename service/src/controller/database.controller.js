const { database } = require('../service/index')
const { getAllDatabase, createDatabase, isDBNameRepeat, updateDatabase, deleteDatabaseById } = database
const { addDbError, dbNameRepeatError, dbNameRepeatUpdateError, updateDbError } = require('../errors/database.err')
const { formatReturn } = require('../utils/format')
class DatabaseHandler {
  getList = async (ctx) => {
    try {
      let dbs = await getAllDatabase()
      console.log(dbs)
      ctx.body = formatReturn(true, dbs)
    } catch (err) {
      console.log(err)
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
      console.log(err)
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
      console.log(err)
      ctx.app.emit('error', updateDbError, ctx)
    }
  }
  removeDb = async (ctx) => {
    try {
      const db = ctx.request.body
      await deleteDatabaseById(db.id)
      ctx.body = formatReturn(true)
    } catch (error) {
      console.log(error)
    }
  }
}
module.exports = new DatabaseHandler()