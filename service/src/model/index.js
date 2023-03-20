const Database = require('./table/Database.model');
const Fields = require('./table/Fields.model');
const Table = require('./table/Table.model');
const { DataTypes } = require('sequelize');
Database.hasMany(Table, {
  onDelete: 'CASCADE',
  foreignKey: {
    type: DataTypes.INTEGER,
    name: 'db_id',
    //RESTRICT、CASCADE、NO ACTION、SET DEFAULT、SET NULL
  },
  sourceKey: 'id',
});
Table.hasMany(Fields, {
  onDelete: 'CASCADE',
  foreignKey: {
    type: DataTypes.INTEGER,
    name: 'tb_id',
  },
  sourceKey: 'id',
});
Database.hasMany(Fields, {
  onDelete: 'CASCADE',
  foreignKey: {
    type: DataTypes.INTEGER,
    name: 'db_id',
    //RESTRICT、CASCADE、NO ACTION、SET DEFAULT、SET NULL
  },
  sourceKey: 'id',
});



Table.belongsTo(Database, {
  onDelete: 'CASCADE',
  foreignKey: {
    type: DataTypes.INTEGER,
    name: 'db_id',
    //RESTRICT、CASCADE、NO ACTION、SET DEFAULT、SET NULL
  },
  targetKey: 'id',
});
Fields.belongsTo(Table, {
  onDelete: 'CASCADE',
  foreignKey: {
    type: DataTypes.INTEGER,
    name: 'tb_id',
  },
  targetKey: 'id',
});
Fields.belongsTo(Database, {
  onDelete: 'CASCADE',
  foreignKey: {
    type: DataTypes.INTEGER,
    name: 'db_id',
    //RESTRICT、CASCADE、NO ACTION、SET DEFAULT、SET NULL
  },
  targetKey: 'id',
});
module.exports = { Database, Fields, Table };
