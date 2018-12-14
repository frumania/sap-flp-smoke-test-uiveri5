/* eslint no-console: */
var fs = require('fs');
var path = require('path');

// 0 - INFO,ERROR
// 1 - +DEBUG
// 2 - +TRACE
// 3 - +trace data

function ConsoleLogger(level){
  this.level = level;
}

ConsoleLogger.prototype.WriteLogFile = function(filePath, fileName, contents) 
{
    var that = this;

    filePath = path.join(__dirname, '../'+filePath);

    that.info('Trying to write file <'+filePath+fileName+'>...');

    //CREATE DIRECTORY IF NOT EXISTS
    that.mkDirByPathSync(filePath);

		fs.writeFile(filePath+fileName, contents, 'utf8', function(err) {
			if(err) {
				return console.log(err);
			}
			that.info('File <'+filePath+fileName+'> written!');
		});
};

ConsoleLogger.prototype.mkDirByPathSync = function(targetDir, { isRelativeToScript = false } = {})
{
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') { // curDir already exists!
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
};

ConsoleLogger.prototype.setLevel = function(newLevel){
  this.level = newLevel;
};

ConsoleLogger.prototype.info = function(msg){ //,args) {
  console.log('INFO: ' + msg); //_.template(msg)(args));
};

ConsoleLogger.prototype.error = function(msg){ //,args) {
  console.log('ERROR: ' + msg); //_.template(msg)(args));
};

ConsoleLogger.prototype.warn = function(msg){ //,args) {
  console.log('WARN: ' + msg); //_.template(msg)(args));
};

ConsoleLogger.prototype.debug = function(msg){ //,args) {
  if(this.level>0) {
    console.log('DEBUG: ' + msg); //_.template(msg)(args));
  }
};

ConsoleLogger.prototype.trace = function(msg){ //,args) {
  if(this.level>1) {
    console.log('TRACE: ' + JSON.stringify(msg)); //_.template(msg)(args));
  }
};

module.exports = function (level) {
  return new ConsoleLogger(level);
};

/*
exports.setLevel = setLevel;
exports.info = info;
exports.error = error;
exports.debug = debug;
exports.trace = trace;
*/