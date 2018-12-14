const plugins = require('../plugins/pluginLoader');
const config = browser.testrunner.config;

var intent = config.intent; //e.g. "#BankAccount-manageMasterData";
var encoded_intent = plugins.getUtils("Actions").encode(intent); 

describe('app', function() {

  beforeEach(function() { //to be replaced by uiveri5 plugin concept
		plugins.getPlugin("ConsoleErrors").start();
  });

  afterEach(function() { //to be replaced by uiveri5 plugin concept
		plugins.getPlugin("ConsoleErrors").end();
  });

  it('Start Application '+encoded_intent, function() {

    plugins.getUtils("Actions").navigate(intent);
    expect(element(by.id("application-"+encoded_intent)).isPresent()).toBeTruthy();
    browser.waitForAngular();
    browser.sleep(1000);
    
  });

});