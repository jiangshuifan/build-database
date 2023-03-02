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
  }
  name = "table_" + instance
  fields: dbField[] = []
  marjorKey: string = ""
  foreignKey: string[] = []
}

export class Database {
  constructor(name?: string, type?: dbType) {
    if (name) this.name = name
    if (type) this.type = type
  }
  name = "database" + instance
  type: dbType = 'MySQL'
  tables: DatabaseTable[] = []
}