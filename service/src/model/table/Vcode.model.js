
const seq = require('../../seq.js')
const { DataTypes } = require('sequelize');
//Verification Code验证码表
const Vcode = seq.define(
  'Vcode',
  {
    'code': {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
      comment: '验证码'
    }
    ,
    'email': {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: 'email'
    },
    'ip': {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: 'ip地址'
    },
    'times': {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      comment: '次数'
    },
    'time_stamp': {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      comment: '时间戳·验证码失效时间戳'
    }
  },
  {
    tableName: 'vcode',
    timestamps: false,
  }
)
module.exports = Vcode