const plugins = require('../plugins/pluginLoader');

describe('flp', function() {

  beforeEach(function() {
		plugins.getPlugin("ConsoleErrors").start(false); //Do not clear browser log
  });

  afterEach(function() {
		plugins.getPlugin("ConsoleErrors").end();
  });

  it('Scroll through dashboard', function() {
		plugins.getUtils("Actions").scrollGroups();
		plugins.getUtils("Actions").scrollToBottom();
  });

});