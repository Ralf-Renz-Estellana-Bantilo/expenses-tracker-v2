import { createConnection } from 'mysql2';

const db_config_dev = {
  host: process.env.NEXT_HOST,
  user: process.env.NEXT_USER,
  password: process.env.NEXT_PASSWORD, 
  database: process.env.NEXT_DATABASE,
}
const db_config_prod = {
  host: process.env.NEXTPRODHOST,
  user: process.env.NEXTPRODUSER,
  password: process.env.NEXTPRODPASSWORD, 
  database: process.env.NEXTPRODDATABASE,
  port: 3306
}

const db = createConnection(db_config_dev);

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
    return;
  }
  console.log('Connected to MySQL database');
});

export default db;