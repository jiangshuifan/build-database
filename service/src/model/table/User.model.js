const seq = require('../../seq')

const { DataTypes } = require('sequelize')

//#region 创建模型方法1
// class User extends Model {}

// User.init()
//#endregion

//创建模型方法2 // const sequelize = new Sequelize('sqlite::memory') const User = sequelize.define('User',{})
const User = seq.define(
  'User',
  {
    //id会自动创建
    account: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: '用户名，唯一',
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '密码',
    },
    header_icon:{
      type: DataTypes.STRING,
      allowNull: false,
      comment: '头像路径',
    },
    fans:{
      type: DataTypes.ARRAY,
      comment: '粉丝',
    },
    attentions:{
      type:DataTypes.ARRAY,
      comment: '关注者',
    },
    is_online:{
      type:DataTypes.STRING,
      comment: '是否在线',
    },
    is_valid:{
      type:DataTypes.BOOLEAN,
      comment:"账号是否有效"
    }
  },
  {
    //设置表名.不设置默认会生成模型名称的复数，也可以通过const sequelize = new Sequelize('sqlite::memory:', { define: {freezeTableName: true}})关闭自动生成复数
    tableName: 'users',
    //设置不自动生成时间戳字段createdAt、updatedAt。也可以单独设置{createdAt:true,updatedAt:false}
    timestamps: false,
  }
)

module.exports = User
