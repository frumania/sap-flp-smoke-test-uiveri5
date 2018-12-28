var meAreaHeaderButton = element(by.id('meAreaHeaderButton'));
var signOut = element(by.id('logoutBtn'));
var okBtn = element(by.id('__mbox-btn-0'));

var jQuery; //AVOID ESLINT ERRORS

var pluginActions = function() 
{
	this.logger;
	/**
	 * _navigate
	 * @param {string} hash
	 */
	this._navigate = function(hash){
		var oCrossAppNavigator = window.sap.ushell.Container.getService("CrossApplicationNavigation");
		oCrossAppNavigator.toExternal({
				target: {
						shellHash: hash
				}
		});
		jQuery.sap.measure.startInteraction(hash,"");
	};

	/**
	 * navigate
	 * @param {string} intent
	 */
	this.navigate = function(intent){

		if(intent && intent != "")
		{
			browser.executeScript(this._navigate, intent).then(function () {
				console.log("INFO: Navigate to "+intent);
			});
		}
		else
		{
			this.logger.error("Config parameter <intent> must not be empty/undefined! Abort!")
			expect(intent).not.toBeUndefined();
		}
	};

	/**
	 * encode Intent
	 */
	this.encode = function(intent){
		
		var encoded_intent = intent.replace("#", "");
		if(encoded_intent.includes("?"))
		{encoded_intent = encoded_intent.substring(0, encoded_intent.indexOf('?'));}

		return encoded_intent;
	};

	/**
	 * logout
	 */
	this.logout = function(){
		meAreaHeaderButton.click();
		signOut.click();
		okBtn.click();
		browser.sleep(2000); //need to wait for logout to actually happen in background
	};

	/**
	 * toggleMeArea
	 */
	this.toggleMeArea = function(){
		meAreaHeaderButton.click();
		expect(meAreaHeaderButton.isPresent()).toBeTruthy();
		meAreaHeaderButton.click();
	};

	/**
	 * scrollGroups
	 */
	this.scrollGroups = function(){
		//Scroll group by group
		element.all(by.css('.sapUshellAnchorNavigationBar .sapUshellAnchorItem')).each(function(element, index) {
			if(index > 0)
			{
				element.click();
				browser.sleep(1000);
			}
		});
	};

	/**
	 * scrollToBottom
	 */
	this.scrollToBottom = function(){
		//Scroll to last visible tile
		var myelement = element.all(by.css('.sapUshellTile')).last();
		browser.actions().mouseMove(myelement).perform();
		browser.sleep(5000);
	};
};

module.exports = new pluginActions();