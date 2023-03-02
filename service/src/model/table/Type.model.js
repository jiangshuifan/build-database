//题目类型
const seq = require('../../seq')
const { DataTypes } = require('sequelize')
const Type = seq.define(
  'Type',
  {
    type_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: '类型名称，唯一，不能为空',
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '类型描述',
    },
  },
  {
    tableName: 'types',
    timestamps: false,
  }
)

module.exports = Type
