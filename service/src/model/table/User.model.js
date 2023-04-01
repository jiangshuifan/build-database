
const seq = require('../../seq.js')
const { DataTypes } = require('sequelize');
const User = seq.define(
  'User',
  {
    'account': {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: '账号、email'
    }
    ,
    'tel': {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      comment: '手机号'
    }
    ,
    'password': {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: '密码'
    }
    ,
    'name': {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
      comment: '昵称'
    }
    ,
    'signatrue': {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
      comment: '签名'
    }
    ,
    'headicon': {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: '头像路径'
    }
  },
  {
    tableName: 'user',
    timestamps: false,
  }
)
module.exports = User
