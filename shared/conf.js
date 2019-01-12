exports.config = {
	//seleniumAddress : 'http://127.0.0.1:4444/wd/hub',
	pluginLoader: {
		filePath: 'results/reports/',
		fileName: 'reproduce.html',
		enable: true
	},
	pluginConsoleErrors: {
		filePath: 'results/reports/',
		fileName: 'error.json',
    exclude: ["i18n", "Content Security Policy", "no valid cache key", "Cached changes", "cache data not available", "Support rule with the id", "Support Assistant", ".support.js", "sap.ushell.services.Notifications", "Notification"],
		strictMode: true,
		enable: true
	},
	intent: '#BankAccount-manageMasterData',
	useSeleniumJar: true,
	useClassicalWaitForUI5: false,
	browserCapabilities: {
		/* maximize browser on all desktops to ensure consistent browser size */
		'chrome,chromium,firefox,ie,edge,safari': {
			'windows,mac,linux': {
			'*': {
				acceptInsecureCerts: true,
				remoteWebDriverOptions: {
					maximized: true,
					browserSize: {
						width: 1024,
						height: 768
						}
					}
				/*
			  seleniumOptions: {
				args: ['-debug', '-log','C:/work/git/openui5/selenium.log']
			  }
			  */
				}
			}
		},
		/* disable informabrs on chrome, use headless chrome on linux/jenkins*/
		'chrome,chromium': {
			'linux': {
				'*': {
					chromeOptions: {
						'args': [
							'disable-infobars',
							'--headless',
							'--disable-gpu'
							// '--window-size=1400,900'
							]/*,
						'perfLoggingPrefs': {
							'enableNetwork': true,
							'enablePage': false,
						}*/
						}/*,
					loggingPrefs: {
					performance: 'ALL',
					browser: 'ALL'
					}*/
					/*
					chromedriverOptions: {
					'enableVerboseLogging': [],
					'loggingTo': ['C:\\work\\git\\openui5\\chromedriver.log']
					}
					*/
				}
			}
		}
	},
	browsers: [{
		browserName: 'chrome',
		platformName: 'linux'
	}],
	profile : 'integration',		
	baseUrl : 'https://host.com/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html?sap-client=000&sap-language=EN',
	pageLoading: {
		wait: '20000',
		initialReload: false
	},	
	/*auth: {
		'fiori-form': {
			user: "CASH",
			pass: "123"
		}
	},*/	
	timeouts : {
		getPageTimeout : '60000',
		allScriptsTimeout : '70000',
		defaultTimeoutInterval : '120000'
	},
	specs: 'specs/app.spec.js',
	reporters : [
		{
		name : './reporter/screenshotReporter',
		screenshotsRoot: 'results/reports/'
		},{
		name: './reporter/junitReporter',
		reportName: 'results/reports/junitReport.xml'
    /*prefix: 'mySuitePrefix',
		postfix: 'mySuitePostfix'*/
	}]
};