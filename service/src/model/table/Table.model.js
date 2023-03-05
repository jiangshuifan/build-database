const seq = require('../../seq')

const { DataTypes } = require('sequelize')

//#region 创建模型方法1
// class User extends Model {}

// User.init()
//#endregion

//创建模型方法2 // const sequelize = new Sequelize('sqlite::memory') const User = sequelize.define('User',{})
const DBTable = seq.define(
  'DBTable',
  {
    //id会自动创建
    tb_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '表名称',
    },
    db_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
      comment: '数据库id,外键',
    },
  },
  {
    //设置表名.不设置默认会生成模型名称的复数，也可以通过const sequelize = new Sequelize('sqlite::memory:', { define: {freezeTableName: true}})关闭自动生成复数
    tableName: 'dbtable',
    //设置不自动生成时间戳字段createdAt、updatedAt。也可以单独设置{createdAt:true,updatedAt:false}
    timestamps: false,
  }
)

module.exports = DBTable
