let dbinstance = 1
let instance = 1

type dbType = 'Postgres' | 'MySQL' | 'MariaDB' | 'SQLite' | 'MicrosoftSQLServe'

export interface dbField {
  field: string,
  name: string,
  type: string
}

export interface columnItem {
  field: string,
  title: string,
  [property: string]: any
}

export const tableFieldColumnList: columnItem[] = [
  { field: 'field', title: '字段名' },
  { field: 'name', title: '字段释义' },
  { field: 'type', title: '类型' },
]

export class DatabaseTable {
  constructor(name: string, fields: dbField[], marjorKey?: string, foreignKey?: string[]) {
    this.name = name
    this.fields = fields
    if (marjorKey) this.marjorKey = marjorKey
    if (foreignKey) this.foreignKey = foreignKey
    instance += 1
    this.id = "table_" + instance
  }
  id = "table_" + instance
  name = "tableName"
  fields: dbField[] = []
  marjorKey: string = ""
  foreignKey: string[] = []
}

export class Database {
  constructor(name?: string, type?: dbType, tables?: DatabaseTable[]) {
    if (name) this.name = name
    if (type) this.type = type
    if (tables) this.tables = tables
    dbinstance += 1
  }
  id = dbinstance
  name = "database" + dbinstance
  type: dbType = 'MySQL'
  tables: DatabaseTable[] = []
}