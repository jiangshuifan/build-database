const seq = require('../../seq')

const { DataTypes } = require('sequelize')
const Foreign = seq.define(
  'Foreign',
  {
    //id会自动创建
    table_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '当前数据库表',
    },
    feild_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '为外键的字段id',
    },
    marjor_key_id: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '对应的主键',
    },
  },
  {
    //设置表名.不设置默认会生成模型名称的复数，也可以通过const sequelize = new Sequelize('sqlite::memory:', { define: {freezeTableName: true}})关闭自动生成复数
    tableName: 'foreign',
    //设置不自动生成时间戳字段createdAt、updatedAt。也可以单独设置{createdAt:true,updatedAt:false}
    timestamps: false,
  }
)

module.exports = Foreign
