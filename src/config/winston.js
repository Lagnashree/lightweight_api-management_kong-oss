const { createLogger, format, transports } = require('winston');
const logLevel = process.env.LOG_LEVEL;


const logger = createLogger({
  level: logLevel || 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.json(),
    format.errors({ stack: true }),
    format.splat()
  ),
  // defaultMeta: { service: 'dev-portal-middleware' },
  transports: [
    new transports.File({ filename: './logs/error.log', level: 'error' }),
    new transports.File({ filename: './logs/combined.log' }),   
    new transports.Console({
      format: format.combine(format.colorize(),format.simple())
    })
  ]
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function (message) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  }
};

module.exports.logger = logger;

