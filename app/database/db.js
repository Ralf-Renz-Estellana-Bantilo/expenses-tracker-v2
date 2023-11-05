import { createConnection } from 'mysql2';

const db_config_dev = {
  host: process.env.NEXT_HOST,
  user: process.env.NEXT_USER,
  password: process.env.NEXT_PASSWORD,
  database: process.env.NEXT_DATABASE,
};

function createNewDbConnection() {
  const newDbConnection = createConnection(db_config_dev);

  newDbConnection.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ', err);
      return;
    }
    console.log('Connected to MySQL database');
  });

  return newDbConnection;
}

export { createNewDbConnection };