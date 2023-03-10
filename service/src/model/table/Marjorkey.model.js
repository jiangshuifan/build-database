const seq = require('../../seq')

const { DataTypes } = require('sequelize')
const Marjor = seq.define(
  'Marjor',
  {
    //id会自动创建
    table_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: '数据库表Id，唯一,不能有多个',
    },
    field_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '为主键的字段id',
    },
  },
  {
    //设置表名.不设置默认会生成模型名称的复数，也可以通过const sequelize = new Sequelize('sqlite::memory:', { define: {freezeTableName: true}})关闭自动生成复数
    tableName: 'marjor',
    //设置不自动生成时间戳字段createdAt、updatedAt。也可以单独设置{createdAt:true,updatedAt:false}
    timestamps: false,
  }
)

module.exports = Marjor
