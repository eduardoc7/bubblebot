import path from 'path';

module.exports = {
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '7CXCj0lbBFSZ3uaM5NxAFW1WjcAM1PQD7r5uMztA',
    database: 'bubblebot',
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
  },
  useNullAsDefault: true,
};
