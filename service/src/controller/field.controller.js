const { field, common } = require('../service/index')
const { getAllField, updateField, isFieldRepeat, createField, deleteFieldById } = field
const { handleFieldAndUpdateRelatedKey } = common
const { queryError, addFdError, fieldRepeatError, fieldRepeatUpdateError, updateFdError } = require('../errors/field.err')
const { formatReturn } = require('../utils/format')

class FieldHandler {
  getList = async (ctx) => {
    try {
      let fd = ctx.request.body
      let tbs = await getAllField(fd.tbId)
      console.log(tbs)
      ctx.body = formatReturn(true, tbs)
    } catch (err) {
      console.log(err)
      ctx.app.emit('error', queryError, ctx)
    }
  }
  addField = async (ctx) => {
    try {
      const fd = ctx.request.body
      let isExist = await isFieldRepeat(fd)
      if (isExist !== false) {
        ctx.app.emit('error', fieldRepeatError, ctx)
      } else {
        const res = await handleFieldAndUpdateRelatedKey('add', fd)
        console.log(res)
        ctx.body = formatReturn(true, { id: res.id })
      }
    } catch (err) {
      console.log(err)
      ctx.app.emit('error', addFdError, ctx)
    }
  }
  updateField = async (ctx) => {
    try {
      let fd = ctx.request.body
      let isExist = await isFieldRepeat(fd)
      if (isExist !== false) {
        ctx.app.emit('error', fieldRepeatUpdateError, ctx)
      } else {
        await handleFieldAndUpdateRelatedKey('update', fd)
        ctx.body = formatReturn(true)
      }
    } catch (err) {
      ctx.app.emit('error', updateFdError, ctx)
    }
  }
  removeField = async (ctx) => {
    try {
      const field = ctx.request.body
      await deleteFieldById(field.id)
      ctx.body = formatReturn(true)
    } catch (err) {
      ctx.app.emit('error', deleteFdError, ctx)
    }
  }
}
module.exports = new FieldHandler()