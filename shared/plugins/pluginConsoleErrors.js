var prefix = "[pluginConsoleErrors] ";

var defaultExcludes = ["Content Security Policy", "no valid cache key", "Cached changes", "cache data not available", "Support rule with the id", "Support Assistant", ".support.js", "sap.ushell.services.Notifications", "Notification"];

var defaultStrict = ["Failed to resolve navigation target:", "is not compliant", "Could not resolve navigation target", 
"Could not open app.", "initial loading of metadata failed", "oData metadata load failed", "HTTP request failed", "Failed to load UI5 component", 
"The app has stopped working", "Data load failed"];

/*var error_medium = ["ESH_SEARCH_SRV", "INTEROP", "A draft exists already", "Could not find primary filename in customer solution", "Invoice document   does not exist", "No plant with authorization found.",
"Please make an entry in all mandatory fields.", "SAML authentication failed.", "Is_modification_allowed", "Cannot modify as the system is currently set to read-only.", "Resource not found for the segment", "No site assigned.", "Failed to fetch cache tokens for the application", "SyntaxError: Unexpected token", 
"TypeError: Cannot read property", "Maintain area of responsibility", "not in customer solution", "Expected to find 1 communication arrangement", "Dataset s4hana_us not found"];
*/

var defaultFilePath = "results/reports/";
var defaultFileName = "error.json";

//https://github.com/angular/protractor-console-plugin

var pluginConsoleErrors = function() 
{
	this.logger;
	this.config;
	
	this.strictMode = function(){
		return this.config.pluginConsoleErrors.strictMode || false;
	};

	this._collectIssue = function(severity, issue)
	{ 	
		if (severity == "ERROR") {
			this.consoleErrors.Error.push(issue);
		}
		if (severity == "WARNING") {
			this.consoleErrors.Warning.push(issue);
		}
		if (severity == "INFO") {
			this.consoleErrors.Info.push(issue);
		}
    };

	this._stringInArray = function(searchterm, list) {
		for (var i = 0; i < list.length; i++) {
			if (searchterm.includes(list[i])) {
				return true;
			}
		}
		return false;
	};

	this._getLogs = function() 
	{
		var that = this;
		
		that.consoleErrors = new Object();
		that.consoleErrors.Error = [];
		that.consoleErrors.Warning = [];
		that.consoleErrors.Info = [];

		//LOAD CONFIG
		var error_excludes = that.config.pluginConsoleErrors.exclude || defaultExcludes //[];
		var error_strict = that.config.pluginConsoleErrors.strict || defaultStrict //[];
		var filePath = that.config.pluginConsoleErrors.filePath || defaultFilePath;
		var fileName = that.config.pluginConsoleErrors.fileName || defaultFileName;

		this.getBrowserLog().then(function(browserLogs) 
		{
			browserLogs.forEach(function(log){

				if (log.level.value > 900) { // 900 => error

					//FILTER EXCLUDES
					if(that.strictMode())
					{
						if(that._stringInArray(log.message, error_strict)) 
						{
							that._collectIssue("ERROR", log);
						}
					}
					else if (!that._stringInArray(log.message, error_excludes)) 
					{
						that._collectIssue("ERROR", log);

						/*if(!that._stringInArray(log.message, error_medium))
						{that._collectIssue("ERROR", log);}
						else
						{that._collectIssue("WARNING", log);}*/
						
						//console.debug("Added to Array");
					}

					//console.debug(log.message);
				}

			});

			that.logger.info(prefix+"Found "+that.consoleErrors.Error.length+" errors in Browser Console!");
			//expect(that.consoleErrors.Error.length).toEqual(0);

			expect(that.consoleErrors.Error.length).toBe(0, "Critical Browser Console Errors");

			//WRITE LOG FILE
			that.logger.WriteLogFile(filePath, fileName, JSON.stringify(that.consoleErrors));
		});
	};

	this._clearConsole = function() {
		this.getBrowserLog();
	};

	this.enabled = function(){
		var enabled = false;
		if(typeof this.config.pluginConsoleErrors !== 'undefined' && this.config.pluginConsoleErrors.enable)
		{
			enabled = this.config.pluginConsoleErrors.enable || false;
		}
		return enabled;
	};

	this.start = function(clear) {

        if(this.enabled())
		{
			if(clear || typeof clear == "undefined")
			{
				this.logger.info(prefix+"Clearing Browser Console!");
				this._clearConsole();
			}
		}
		else
		{
			this.logger.warn(prefix+'Not enabled!');
		}
	};

	this.end = function() 
	{
        if(this.enabled())
		{
			//browser.sleep(5000);
			this.logger.info(prefix+"Checking Browser Console for errors!");
			this._getLogs();
		}
	};

	/**
	 * Gets the browser log.
	 *
	 * @return {webdriver.promise.Promise.<!Array.<!webdriver.logging.Entry>>}
	 */
	this.getBrowserLog = function() {
		return browser.manage().logs().get('browser');
    };

};

module.exports = new pluginConsoleErrors();


//GET XHR ERRORS
/*browser.manage().logs().get('performance').then((browserLogs) => {
	browserLogs.forEach((browserLog) => {
		var message = JSON.parse(browserLog.message).message;
		if (message.method == 'Network.responseReceived') {
			if(message.params.response.status.toString().charAt(0) == "4" || message.params.response.status.toString().charAt(0) == "5")
			{
				console.log("Network Error");
				console.log(message);
			}
		}
	});
});
*/