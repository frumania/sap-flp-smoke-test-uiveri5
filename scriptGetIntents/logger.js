const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
var fs = require('fs');
var errorlog = 'error.log';
var combinedlog = 'combined.log';

const myFormat = printf(info => {

  if(info.details)
  return `${info.timestamp} [${info.level}] ${info.message} ${info.details}\n`;
  else
  return `${info.timestamp} [${info.level}] ${info.message}`;

});

const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: errorlog, level: 'error' }),
    new transports.File({ filename: combinedlog })
  ]
});

function clearLogs()
{
  fs.unlinkSync(errorlog);
  fs.unlinkSync(combinedlog);
}

function getLogHandler()
{
  clearLogs();
  return logger;
}

module.exports = {
  clearLogs: clearLogs,
	getLogHandler: getLogHandler
};