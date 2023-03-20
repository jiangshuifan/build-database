const seq = require('../../seq')

const { DataTypes } = require('sequelize')

//#region 创建模型方法1
// class User extends Model {}

// User.init()
//#endregion

//创建模型方法2 // const sequelize = new Sequelize('sqlite::memory') const User = sequelize.define('User',{})
const TbFields = seq.define(
  'TableField',
  {
    //id会自动创建
    field: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '字段名称，英文字段',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '字段名称·释义',
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '字段类型',
    },
    is_marjor_key: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: '主键',
    },
    is_foreign_key: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      comment: '外键',
    },
    tb_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
      comment: '数据库表id,外键',
    },
    target_key: {
      type: DataTypes.NUMBER,
      allowNull: true,
      comment: '对应的主键的id',
    },
    allow_null: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: '是否允许为空',
    },
    unique: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment: '是否唯一',
    },
    db_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
      comment: '数据库id,外键',
    },
  },
  {
    //设置表名.不设置默认会生成模型名称的复数，也可以通过const sequelize = new Sequelize('sqlite::memory:', { define: {freezeTableName: true}})关闭自动生成复数
    tableName: 'tbFields',
    //设置不自动生成时间戳字段createdAt、updatedAt。也可以单独设置{createdAt:true,updatedAt:false}
    timestamps: false,
  }
)

module.exports = TbFields
