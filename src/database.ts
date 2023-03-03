let dbinstance = 1
let instance = 1

type dbType = 'Postgres' | 'MySQL' | 'MariaDB' | 'SQLite' | 'MicrosoftSQLServe'

export interface dbField {
  field: string,
  name: string,
  type: string,
  isForeignKey?: boolean,
  isMarjorKey?: boolean,
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
  { field: 'isMarjorKey', title: '是否为主键' },
  { field: 'isForeignKey', title: '是否为外键' },
]

export class DatabaseTable {
  constructor(name: string, fields: dbField[], data?: { [property: string]: any }[]) {
    this.name = name
    this.fields = fields
    instance += 1
    this.id = "table_" + instance
    if (data) { this.data = data }
  }
  id = "table_" + instance
  name = "tableName"
  fields: dbField[] = []
  data: { [property: string]: any }[] = []
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