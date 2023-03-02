const seq = require('../../seq')

const { DataTypes } = require('sequelize');
const Problem = seq.define(
  'Problem',
  {
    //id会自动创建
    problem: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '问题',
    },
    answer: {
      type: DataTypes.STRING,
      comment: '答案',
    },
    comment:{
      type: DataTypes.STRING,
      allowNull: true,
      comment: '评论',
    }
  },
  {
    tableName: 'problems',
    timestamps: false,
  }
);

module.exports = Problem;
