const { database } = require('../service/index')
const { getAllDatabase, createDatabase, isDBNameRepeat, updateDatabase, deleteDatabaseById } = database
const { removeDbError, queryError, addDbError, dbNameRepeatError, dbNameRepeatUpdateError, updateDbError } = require('../errors/database.err')
const { formatReturn } = require('../utils/format')
class DatabaseHandler {
  getList = async (ctx) => {
    try {
      let dbs = await getAllDatabase()
      ctx.body = formatReturn(true, dbs)
    } catch (err) {
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
}
module.exports = new DatabaseHandler()