export enum LogLevel {
    INFO = 'INFO',
    DEBUG = 'DEBUG',
    WARN = 'WARN',
    ERROR = 'ERROR',
}
type TMessage = string | unknown
export class CustomLogger {
    private logLevel: LogLevel

    constructor(logLevel: LogLevel = LogLevel.INFO) {
        this.logLevel = logLevel
    }

    private log(message: TMessage, level: LogLevel) {
        const timestamp = new Date().toISOString()
        // eslint-disable-next-line no-console
        console.log(`[${timestamp}] [${level}] ${message}`)
    }

    info(message: TMessage) {
        if (this.shouldLog(LogLevel.INFO)) {
            this.log(message, LogLevel.INFO)
        }
    }

    debug(message: TMessage) {
        if (this.shouldLog(LogLevel.DEBUG)) {
            this.log(message, LogLevel.DEBUG)
        }
    }

    warn(message: TMessage) {
        if (this.shouldLog(LogLevel.WARN)) {
            this.log(message, LogLevel.WARN)
        }
    }

    error(message: TMessage) {
        if (this.shouldLog(LogLevel.ERROR)) {
            this.log(message, LogLevel.ERROR)
        }
    }

    setLogLevel(level: LogLevel) {
        this.logLevel = level
    }

    private shouldLog(level: LogLevel): boolean {
        const levels = Object.values(LogLevel)
        return levels.indexOf(level) >= levels.indexOf(this.logLevel)
    }
}

export const errorLogger = new CustomLogger(LogLevel.ERROR)
export const infoLogger = new CustomLogger(LogLevel.INFO)
// Usage
// const logger = new Logger(LogLevel.DEBUG)

// logger.info("This is an info message.")
// logger.debug("This is a debug message.")
// logger.warn("This is a warning message.")
// logger.error("This is an error message.")
