const validateParams = async (params, requiredParams) => {
  let errCount = 0
  let errParams = []
  requiredParams.forEach(v => {
    if (params[v] == undefined) {
      errCount++
      errParams.push(v)
    }
  })
  if (errCount > 0) {
    return {
      success: false,
      errParams
    }
  } else {
    return {
      success: true
    }
  }
}

module.exports = {
  validateParams
}