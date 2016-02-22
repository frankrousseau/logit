// Generated by CoffeeScript 1.10.0
var Logger, colors, dateFormat, levelColors,
  slice = [].slice;

dateFormat = require('./date-format');

module.exports = function(options) {
  return new Logger(options);
};

colors = {
  blue: ['\x1B[34m', '\x1B[39m'],
  cyan: ['\x1B[36m', '\x1B[39m'],
  green: ['\x1B[32m', '\x1B[39m'],
  magenta: ['\x1B[36m', '\x1B[39m'],
  red: ['\x1B[31m', '\x1B[39m'],
  yellow: ['\x1B[33m', '\x1B[39m']
};

levelColors = {
  error: colors.red,
  debug: colors.green,
  warn: colors.yellow,
  info: colors.blue
};

Logger = (function() {
  function Logger(options1) {
    this.options = options1;
    if (this.options == null) {
      this.options = {};
    }
    if (this.options.date && (this.options.dateFormat == null)) {
      this.options.dateFormat = 'YYYY-MM-DD hh:mm:ss:S';
    }
  }

  Logger.prototype.colorify = function(text, color) {
    return "" + color[0] + text + color[1];
  };

  Logger.prototype.stringify = function(text) {
    if (text instanceof Error && text.stack) {
      text = text.stack;
    } else if (text instanceof Object) {
      text = JSON.stringify(text);
    }
    return text;
  };

  Logger.prototype.getFileAndLine = function() {
    var browserReg, fileAndLineInfos, filePath, firstLineStack, line, nodeReg, stacklist;
    stacklist = (new Error()).stack.split('\n').slice(4);
    nodeReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
    browserReg = /at\s+()(.*):(\d*):(\d*)/gi;
    firstLineStack = stacklist[0];
    fileAndLineInfos = nodeReg.exec(firstLineStack) || browserReg.exec(firstLineStack);
    filePath = fileAndLineInfos[2].substr(process.cwd().length);
    line = fileAndLineInfos[3];
    return "." + filePath + ":" + line + " |";
  };

  Logger.prototype.format = function(level, texts) {
    var date, text;
    if (process.env.DEBUG) {
      texts.unshift(this.getFileAndLine());
    }
    text = ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = texts.length; i < len; i++) {
        text = texts[i];
        results.push(this.stringify(text));
      }
      return results;
    }).call(this)).join(" ");
    if (this.options.prefix != null) {
      text = this.options.prefix + " | " + text;
    }
    if (process.env.NODE_ENV !== 'production') {
      level = this.colorify(level, levelColors[level]);
    }
    if (level) {
      text = level + " - " + text;
    }
    if (this.options.date) {
      date = new Date().format(this.options.dateFormat);
      text = "[" + date + "] " + text;
    }
    return text;
  };

  Logger.prototype.info = function() {
    var texts;
    texts = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (process.env.DEBUG || process.env.NODE_ENV !== 'test') {
      return console.info(this.format('info', texts));
    }
  };

  Logger.prototype.warn = function() {
    var texts;
    texts = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (process.env.DEBUG || process.env.NODE_ENV !== 'test') {
      console.info(this.format('warn', texts));
      return console.warn(this.format('warn', texts));
    }
  };

  Logger.prototype.error = function() {
    var texts;
    texts = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (process.env.DEBUG || process.env.NODE_ENV !== 'test') {
      console.info(this.format('error', texts));
      return console.error(this.format('error', texts));
    }
  };

  Logger.prototype.debug = function() {
    var texts;
    texts = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    if (process.env.DEBUG) {
      return console.info(this.format('debug', texts));
    }
  };

  Logger.prototype.raw = function() {
    var texts;
    texts = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return console.log.apply(console, texts);
  };

  Logger.prototype.lineBreak = function(text) {
    return this.raw(Array(80).join("*"));
  };

  return Logger;

})();
