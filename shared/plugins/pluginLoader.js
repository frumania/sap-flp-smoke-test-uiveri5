const config = browser.testrunner.config;
//var logger = require('/usr/local/lib/node_modules/visualtestjs/src/logger')(config.verbose);
var logger = require('./pluginLogger')(config.verbose);
var fs = require('fs');
var path = require('path');

var prefix = "[pluginLoader] ";
var defaultFilePath = "results/reports/";
var defaultFileName = "reproduce.html";

var pluginLoader = function() 
{
	this.getPlugin = function(name) 
	{
		var plugin = require('./plugin'+name);
		plugin.logger = logger;
		plugin.config = config;
		return plugin;
	};

	this.getUtils = function(name) 
	{
		var plugin = require('../utils/utils'+name);
		plugin.logger = logger;
		plugin.config = config;
		return plugin;
	};

	this.createReproduceHTML = function()
	{
		var enabled = this.config.pluginLoader.enable || false;

        if(enabled)
        {
			var filePath = this.config.pluginLoader.filePath || defaultFilePath;
			var fileName = this.config.pluginLoader.fileName || defaultFileName;

			var url = (config.baseUrl || "") + (config.intent || "");
			var user = config.auth[Object.keys(config.auth)[0]].user || "";
			var pw = config.auth[Object.keys(config.auth)[0]].pass || "";
			var intent = config.intent || "";

			var htmlfilePath = path.join(__dirname, 'pluginLoader.html');

			var htmlcontents = fs.readFileSync(htmlfilePath).toString();
			htmlcontents = htmlcontents.replace("###URL###", url);
			htmlcontents = htmlcontents.replace("###USER###", user);
			htmlcontents = htmlcontents.replace("###PW###", pw);
			htmlcontents = htmlcontents.replace("###INTENT###", intent);

			this.logger.WriteLogFile(filePath, fileName, htmlcontents);
		}
	};

	this.logger = logger;
	this.config = config;
	this.logger.info(prefix+'initialized...');
	this.createReproduceHTML();
};

module.exports = new pluginLoader();