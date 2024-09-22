import { createConnection } from "mysql2"
import { CustomLogger, LogLevel } from "../utils/logger"

const db_config_dev = {
  host: process.env.NEXT_HOST,
  user: process.env.NEXT_USER,
  password: process.env.NEXT_PASSWORD,
  database: process.env.NEXT_DATABASE,
}

function createNewDbConnection() {
  const newDbConnection = createConnection(db_config_dev)
  const errorLogger = new CustomLogger(LogLevel.ERROR)
  const infoLogger = new CustomLogger(LogLevel.INFO)

  newDbConnection.connect((err) => {
    if (err) {
      errorLogger.error("Error connecting to the database: ", err)
      return
    }
    infoLogger.info("Connected to MySQL database")
  })

  return newDbConnection
}

export { createNewDbConnection }
