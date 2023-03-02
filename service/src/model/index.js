const User = require('./table/User.model');
const Type = require('./table/Type.model');
const Problem = require('./table/Problem.model');
const ValidateCode = require('./table/ValidateCode.model');
const { DataTypes } = require('sequelize');
User.hasMany(Type, {
  onDelete: 'CASCADE',
  foreignKey: {
    type: DataTypes.INTEGER,
    name: 'user_id',
    //RESTRICT、CASCADE、NO ACTION、SET DEFAULT、SET NULL
  },
  sourceKey: 'account',
});
Type.hasMany(Problem, {
  onDelete: 'CASCADE',
  foreignKey: {
    type: DataTypes.INTEGER,
    name: 'problem_id',
  },
  sourceKey: 'id',
});

Type.belongsTo(User, {
  onDelete: 'CASCADE',
  foreignKey: {
    type: DataTypes.INTEGER,
    name: 'account',
    //RESTRICT、CASCADE、NO ACTION、SET DEFAULT、SET NULL
  },
  targetKey: 'id',
});
Problem.belongsTo(Type, {
  onDelete: 'CASCADE',
  foreignKey: {
    type: DataTypes.INTEGER,
    name: 'problem_id',
  },
  targetKey: 'id',
});


module.exports = { User, Type, Problem,ValidateCode};
