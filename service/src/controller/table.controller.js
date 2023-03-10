const { table, field, common } = require('../service/index')
const { getAllTable, updateTable, isTBNameRepeat, createTable, deleteTableById } = table
const { getAllField } = field
const { createTableAndSetDefaultField } = common
const { updateError, queryTbError, addTbError, tbNameRepeatError, tbNameRepeatUpdateError } = require('../errors/table.err')
const { formatReturn } = require('../utils/format')

class TableHandler {
  getList = async (ctx) => {
    try {
      const data = ctx.request.body
      let tbs = await getAllTable(data.dbId)
      ctx.body = formatReturn(true, tbs)
    } catch (err) {
      ctx.app.emit('error', queryTbError, ctx)
    }
  }
  addTb = async (ctx) => {
    try {
      const tb = ctx.request.body
      let isExist = await isTBNameRepeat(tb)
      if (isExist !== false) {
        ctx.app.emit('error', tbNameRepeatError, ctx)
      } else {
        const res = await createTableAndSetDefaultField(tb)
        ctx.body = formatReturn(true, { id: res.id })
      }
    } catch (err) {
      console.log(err)
      ctx.app.emit('error', addTbError, ctx)
    }
  }
  updateTb = async (ctx) => {
    try {
      const tb = ctx.request.body
      let isExist = await isTBNameRepeat(tb)
      if (isExist !== false) {
        ctx.app.emit('error', tbNameRepeatUpdateError, ctx)
      } else {
        await updateTable(tb.id, tb)
        ctx.body = formatReturn(true)
      }
    } catch (err) {
      ctx.app.emit('error', updateError, ctx)
    }
  }
  removeTb = async (ctx) => {
    try {
      const tb = ctx.request.body
      await deleteTableById(tb.id)
      ctx.body = formatReturn(true)
    } catch (err) {
      console.log(err)
    }
  }

  getTableTree = async (ctx) => {
    try {
      const data = ctx.request.body
      let tbs = await getAllTable(data.dbId)
      for (let i = 0; i < tbs.length; i++) {
        let nodes = await getAllField(tbs[i].id)
        console.log('==', nodes)
        tbs[i].children = nodes
      }
      ctx.body = formatReturn(true, tbs)
    } catch (err) {
      console.log(err)
    }
  }
}
module.exports = new TableHandler()