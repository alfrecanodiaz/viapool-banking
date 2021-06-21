export default () => ({
  environment: process.env.NODE_ENV,
  appName: process.env.APP_NAME,
  appPort: process.env.APP_PORT,
  appUri: process.env.APP_URI,
  swaggerUri: process.env.APP_DOCS_URI,
  postgresConn: {
    type: process.env.ORM_TYPE,
    host: process.env.ORM_HOST,
    port: process.env.ORM_PORT,
    username: process.env.ORM_USER,
    password: process.env.ORM_PASS,
    database: process.env.ORM_DB,
    logging: process.env.NODE_ENV === 'development',
    autoLoadEntities: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: true,
  },
});
