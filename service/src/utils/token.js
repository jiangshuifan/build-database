const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')
let KEY_PUBLIC_PATH = path.resolve(__dirname, "../../private/keys/public.pem")
let KEY_PRIVATE_PATH = path.resolve(__dirname, "../../private/keys/private.pem")

const createToken = async (params) => {
  let privateKey = fs.readFileSync(KEY_PRIVATE_PATH);
  let token = jwt.sign(params, privateKey, {
    algorithm: "RS256",
    expiresIn: "5s",
  });
  return token
}

const validateToken = async (token) => {
  let publicKey = fs.readFileSync(KEY_PUBLIC_PATH);
  return new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, { algorithm: "RS256" }, (err, payload) => {
      if (err) {
        //err:{name:'',message:''}
        if (err.name === 'TokenExpiredError') {
          resolve({
            isvalid: false,
            message: 'token超时'
          })
        } else if (err.name === 'JsonWebTokenError') {
          resolve({
            isvalid: 0,
            message: 'token无效'
          })
        } else if (err.name === 'NotBeforeError') {
          resolve({
            isvalid: 0,
            message: err.massage
          })
        } else {
          reject(err)
        }
      } else {
        resolve({
          isvalid: true,
          message: payload
        })
      }
    })
  })
}

module.exports = {
  createToken, validateToken
}
