import { Column, ColumnOptions, ColumnType } from 'typeorm';

const mysqlSqliteTypeMapping: { [key: string]: ColumnType } = {
  timestamp: 'datetime',
};

export function resolveDbType(mySqlType: ColumnType): ColumnType {
  const isTestEnv = process.env.NODE_ENV === 'test';
  if (isTestEnv && mySqlType.toString() in mysqlSqliteTypeMapping) {
    return mysqlSqliteTypeMapping[mySqlType.toString()];
  }
  return mySqlType;
}

export function DbAwareColumn(columnOptions: ColumnOptions) {
  if (columnOptions.type) {
    columnOptions.type = resolveDbType(columnOptions.type);
  }
  return Column(columnOptions);
}
