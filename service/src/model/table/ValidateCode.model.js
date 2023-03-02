const seq = require('../../seq')

const { DataTypes } = require('sequelize')
const ValidateCode = seq.define(
  'ValidateCode',
  {
    account: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: '账号，唯一',
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '验证码',
    },
  },
  {
    tableName: 'validatecodes',
    timestamps: false,
  }
)

module.exports = ValidateCode
