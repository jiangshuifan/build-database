
type dbType = 'Postgres' | 'MySQL' | 'MariaDB' | 'SQLite' | 'MicrosoftSQLServe'



export interface columnItem {
  field: string,
  title: string,
  [property: string]: any
}
//数据库
export interface dbParams {
  id?: number | string,
  dbName?: string,
  dbType?: dbType,
  isPrivate?: boolean,
  password?: string
}
//数据库表
export interface tbParams {
  tbName: string,
  dbId: number | string,
  id?: number | string,
}
//数据库字段
export interface dbField {
  id?: number | string,
  tbId: number | string,
  field: string,
  fdName: string,
  fdType: string,
  isForeignKey?: boolean,
  isMarjorKey?: boolean,
}


export const tableFieldColumnList: columnItem[] = [
  { field: 'field', title: '字段名' },
  { field: 'fdName', title: '字段释义' },
  { field: 'fdType', title: '类型' },
  { field: 'isMarjorKey', title: '是否为主键' },
  { field: 'isForeignKey', title: '是否为外键' },
]



export class Database {
  constructor(params: dbParams) {
    if (Object.hasOwn(params, 'dbName')) {
      this.dbName = params.dbName as string
    }
    if (Object.hasOwn(params, 'type')) {
      this.dbType = params.dbType as dbType
    }
    if (Object.hasOwn(params, 'isPrivate')) {
      this.isPrivate = params.isPrivate as boolean
    }
    if (Object.hasOwn(params, 'password')) {
      this.password = params.password as string
    }
  }
  id: undefined | number = undefined
  dbName = "database" + new Date().getTime()
  dbType: dbType = 'MySQL'
  tables: DatabaseTable[] = []
  isPrivate: boolean = false
  password: string = ''
}
export class DatabaseTable {
  constructor(params: tbParams) {
    if (Object.hasOwn(params, 'tbName')) {
      this.tbName = params.tbName as string
    }
    this.dbId = params.dbId
  }

  id: undefined | number = undefined
  tbName = "tableName" + new Date().getTime()
  dbId: number | string = ""
}
export class TableField {
  constructor(params: dbField) {
    if (Object.hasOwn(params, 'isForeignKey')) {
      this.isForeignKey = params.isForeignKey as boolean
    }
    if (Object.hasOwn(params, 'isMarjorKey')) {
      this.isMarjorKey = params.isMarjorKey as boolean
    }
    this.fdName = params.fdName
    this.tbId = params.tbId
    this.fdType = params.fdType
    this.field = params.field
  }
  id: undefined | number = undefined
  field: string = "field"
  tbId: number | string = ""
  fdName: string = "字段释义"
  fdType: string = ""
  isForeignKey: boolean = false
  isMarjorKey: boolean = false
}