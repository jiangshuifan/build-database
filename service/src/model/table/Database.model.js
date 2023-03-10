const seq = require('../../seq')

const { DataTypes } = require('sequelize')

//#region 创建模型方法1
// class User extends Model {}

// User.init()
//#endregion

//创建模型方法2 // const sequelize = new Sequelize('sqlite::memory') const User = sequelize.define('User',{})
const Database = seq.define(
  'Database',
  {
    //id会自动创建
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: '数据库名称，唯一',
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '数据库类型',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '描述',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '密码',
    },
    is_private: {
      type: DataTypes.BOOLEAN,
      comment: "数据库是否是加密的"
    }
  },
  {
    //设置表名.不设置默认会生成模型名称的复数，也可以通过const sequelize = new Sequelize('sqlite::memory:', { define: {freezeTableName: true}})关闭自动生成复数
    tableName: 'database',
    //设置不自动生成时间戳字段createdAt、updatedAt。也可以单独设置{createdAt:true,updatedAt:false}
    timestamps: false,
  }
)

module.exports = Database
