const Data = require('./table/Data.model');
const Database = require('./table/Database.model');
const Fields = require('./table/Fields.model');
const Table = require('./table/Table.model');
const Marjor = require('./table/Marjorkey.model');
const Foreign = require('./table/Foreignkey.model');
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
Table.hasMany(Data, {
  onDelete: 'CASCADE',
  foreignKey: {
    type: DataTypes.INTEGER,
    name: 'tb_id',
  },
  sourceKey: 'id',
});
Marjor.hasMany(Foreign, {
  onDelete: 'CASCADE',
  foreignKey: {
    type: DataTypes.INTEGER,
    name: 'marjor_key_id',
  },
  sourceKey: 'id',
})


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
Data.belongsTo(Table, {
  onDelete: 'CASCADE',
  foreignKey: {
    type: DataTypes.INTEGER,
    name: 'tb_id',
  },
  targetKey: 'id',
});
Foreign.belongsTo(Marjor, {
  onDelete: 'CASCADE',
  foreignKey: {
    type: DataTypes.INTEGER,
    name: 'marjor_key_id',
  },
  targetKey: 'id',
});

module.exports = { Data, Database, Fields, Table, Marjor, Foreign };
