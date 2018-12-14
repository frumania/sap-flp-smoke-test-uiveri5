var app_excludes = ["Shell", "explace", "UserDefaults","dlm", "MarketingAPI", "ConfigurationObject", "uitype=advanced", "*-", "copilot", "quickview", "quickcreate"];
var debug = false;
var logger;

//CONSTRUCTOR
function utilsabapflp(_user, _logger)
{
	this.user = _user;
	this.logger = _logger;
}

/**
 * getSuffix
 */
function getSuffix() {
	var suffix = "/sap/opu/odata/UI2/PAGE_BUILDER_PERS/Pages('%2FUI2%2FFiori2LaunchpadHome')/allCatalogs?$expand=Chips/ChipBags/ChipProperties&$orderby=title&$filter=type";
	suffix += "%20eq%20%27CATALOG_PAGE%27%20or%20type%20eq%20%27H%27%20or%20type%20eq%20%27SM_CATALOG%27%20or%20type%20eq%20%27REMOTE%27&$format=json";
	
	return suffix;
};

//CHECKS IF SEARCHTERM IS IN LIST/ARRAY
function StringInArray(searchterm, list) {
    for (var i = 0; i < list.length; i++) {
        if (searchterm.includes(list[i])) {
            return true;
        }
    }
    return false;
}

function getTitlefromChips(tile)
{
	var title = "";
	if(tile.ChipBags.results.length > 0)
	{
		for (var l = 0; l< tile.ChipBags.results.length; l++) 
		{
			if(tile.ChipBags.results[l].ChipProperties.results.length > 0)
			{
				for (var p = 0; p< tile.ChipBags.results[l].ChipProperties.results.length; p++) 
				{
					if(tile.ChipBags.results[l].ChipProperties.results[p].name == "display_title_text" || tile.ChipBags.results[l].ChipProperties.results[p].name == "title")
					{
						title = tile.ChipBags.results[l].ChipProperties.results[p].value;
					}

					if(tile.ChipBags.results[l].ChipProperties.results[p].name == "display_subtitle_text")
					{
						var value = tile.ChipBags.results[l].ChipProperties.results[p].value;
						if(value != "")
						title += " - "+value;
					}
				}
			}
		}
	}
	return title;
}

function sortByTargetMapping(a,b) {
	if(isTargetMapping(a))
	  return -1;
	else
	  return 1;
}

function sortByTile(a,b) {
	if(!isTargetMapping(a))
	  return -1;
	else
	  return 1;
}
  
function sortAlhpabetically(a,b) {
	if (a.appid < b.appid)
	  return -1;
	else
	  return 1;
}

function removeTechTag(text)
{
	text = text.replace("?sap-ui-tech-hint=GUI","");
	text = text.replace("?sap-ui-tech-hint=WDA","");
	text = text.replace("?sap-ui-tech-hint=UI5","");
	return text;
}
  
function IsDuplicate(item, list)
{
	//CHECK FOR DUPLICATES
    var found = false;
	for (var i = 0; i < list.length; i++) 
	{
		//REMOVE TECH PARAMS
		if(removeTechTag(item.appid) == removeTechTag(list[i].appid) && item.type == list[i].type)
		{found = true;}

		if(item.ui5_component != "" && item.ui5_component == list[i].ui5_component && !removeTechTag(item.appid).includes("?"))
		{found = true;}
	}
	
	return found;
}

function isTargetMapping(tile)
{
	if(tile.url.includes("action") || tile.title.includes("Target Mapping"))
	{return true;}
	else
	{return false;}
}

function checkIfIsMatch(tile, target_mapping, type)
{
	if(tile.semanticObject == target_mapping.semanticObject 
	&& tile.semanticAction == target_mapping.semanticAction 
	&& type == target_mapping.type)	
	{return true;}
	else if (tile.semanticAction == "analyzeSBKPIDetailsS4HANA" && target_mapping.semanticAction == "analyzeSBKPIDetailsS4HANA" && target_mapping.semanticObject == "*")
	{return true;}
	else
	{return false;}
}

//FIND URL PARAMS FOR URL
//function extractAdditionalParams(mytile,myappid)
utilsabapflp.prototype.extractAdditionalParams = function(mytile, myappid)
{
	var paramObj = {};
	var blacklist = "";
	var params = "";
	var that = this;

	if(mytile.signature && mytile.signature.parameters){
		var myparams = mytile.signature.parameters;
		for (var key in myparams) {
			var obj = myparams[key];
			
			if(obj.required){
				var value = "";
				
				if(obj.filter && obj.filter.value)
				{
					value = obj.filter.value;	
				}
				
				if(value == "")
				{
					that.logger.log('debug', "["+that.user+"] Target Mapping " + myappid + " blacklisted! (No default value for mandatory parameter "+key+" found!");
					blacklist = "BLACKLISTED_MANDATORY_PARAM;";
				}
				
				if(!myappid.includes(key))
				{
					if(myappid.includes("?") || params.includes("?"))
					{
						params += "&"+key+"="+value;
					}
					else
					{
						params += "?"+key+"="+value;
					}
				}
			}
			else
			{
				if(obj.defaultValue && obj.defaultValue.value && obj.defaultValue.value != "" && !obj.defaultValue.value.includes("UserDefault"))
				{
					value = obj.defaultValue.value;	

					if(!myappid.includes(key))
					{
						if(myappid.includes("?") || params.includes("?"))
						{
							params += "&"+key+"="+value;
						}
						else
						{
							params += "?"+key+"="+value;
						}
					}
				}
			}
		}
	}

	paramObj.params = params;
	paramObj.blacklist = blacklist;
	return paramObj;
};

/**
 * getIntents
 * @param {json} data
 */
//function getIntents(data) {
utilsabapflp.prototype.getIntents = function(data) {

	var target_mappings = [];
	var allChips = 0;
	var that = this;

	//PROCESS ALL TARGET MAPPINGS
	data.d.results.forEach(function(oCatalog) {
		
		oCatalog.Chips.results.forEach(function(target_mapping)
		{
			allChips++;

			if(isTargetMapping(target_mapping))
			{
				if (target_mapping.configuration != "") 
				{
					//LOAD DATA
					var target_mapping_config = JSON.parse(target_mapping.configuration);
					var mytarget_mapping = JSON.parse(target_mapping_config.tileConfiguration);

					//EXTRACT TYPE
					var mytype = "";
					if (mytarget_mapping.navigation_provider) {
						mytype = mytarget_mapping.navigation_provider;
					}
					
					//EXTRACT TITLE
					var mydesc = "";
					if(mytarget_mapping.display_title_text && mytarget_mapping.display_title_text != "" && mytarget_mapping.display_title_text != "Analyze KPI Details")
					{mydesc = mytarget_mapping.display_title_text;}
					else
					{mydesc = getTitlefromChips(target_mapping);}

					//EXTRACT INTENT
					var myappid = "#" + mytarget_mapping.semantic_object + "-" + mytarget_mapping.semantic_action;
					var paramsObj = that.extractAdditionalParams(mytarget_mapping,myappid);
					var blacklist = "";
					if(paramsObj.blacklist != ""){blacklist = paramsObj.blacklist;}

					myappid += paramsObj.params;

					var target_mapping_obj = {
						catalogId: oCatalog.id.replace("X-SAP-UI2-CATALOGPAGE:", ""),
						catalogTitle: oCatalog.title,
						appid: myappid,
						semanticObject: mytarget_mapping.semantic_object,
						semanticAction: mytarget_mapping.semantic_action,
						desc: mydesc,
						type: mytype,
						category: "TargetMapping",
						category_tech: target_mapping.baseChipId,
						ui5_component: mytarget_mapping.ui5_component,
						url: mytarget_mapping.url,
						blacklist: blacklist
						//targetmapping: mytarget_mapping
					};

					if(debug)
					target_mapping_obj.targetmapping = mytarget_mapping

					//console.log(target_mapping);
					target_mappings.push(target_mapping_obj);
				}
				else
				{
					that.logger.log('error', "["+that.user+"] Tile could not be parsed - no config for <"+target_mapping.title+">");
					allChips--;
				}
			}
		});

	});

	var tiles = [];

	//PROCESS ALL TILES
	data.d.results.forEach(function(oCatalog) {
		
		oCatalog.Chips.results.forEach(function(tile)
		{
			if(!isTargetMapping(tile))
			{
				if (tile.configuration != "") 
				{
					//LOAD DATA
					var tile_config = JSON.parse(tile.configuration);
					var mytile = JSON.parse(tile_config.tileConfiguration);
					var mytype = "";

					//HANDLE SSB ANALYTICAL TILES
					if(mytile.TILE_PROPERTIES)
					{
						mytile = JSON.parse(mytile.TILE_PROPERTIES);

						mytile.semantic_object = mytile.semanticObject;
						mytile.semantic_action = mytile.semanticAction;
						myappid = "#" + mytile.semantic_object + "-" + mytile.semantic_action;

						evaluationId = mytile.evaluationId
						if(evaluationId && evaluationId != "")
						{myappid += "?EvaluationId="+evaluationId;}
					}
					else
					{
						mytile.semantic_object = mytile.navigation_semantic_object;
						mytile.semantic_action = mytile.navigation_semantic_action;
						myappid = mytile.navigation_target_url;
					}

					if(myappid.includes("GUI") || myappid.includes("uitype=advanced"))
					mytype = "TR";
					if(myappid.includes("WDA"))
					mytype = "WDA";

					//EXTRACT TITLE
					var mydesc = "";
					if(mytile.display_title_text && mytile.display_title_text != "" && mytile.display_title_text != "Analyze KPI Details")
					{mydesc = mytile.display_title_text;}
					else
					{mydesc = getTitlefromChips(tile);}

					var tile_obj = {
						catalogId: oCatalog.id.replace("X-SAP-UI2-CATALOGPAGE:", ""),
						catalogTitle: oCatalog.title,
						appid: myappid,
						semanticObject: mytile.semantic_object,
						semanticAction: mytile.semantic_action,
						desc: mydesc,
						type: mytype,
						category: "Tile",
						category_tech: tile.baseChipId,
						blacklist: "",
						tile: mytile
					};

					tiles.push(tile_obj);
				}
				else
				{
					that.logger.log('error', "["+that.user+"] Tile could not be parsed - no config for <"+tile.title+">");
					allChips--;
				}
			}
		});

	});

	//FIND TARGET MAPPING FOR TILE
	var merged = [];

	tiles.forEach(function(tile) {

		var found = false;
		var found_num = 0;

		target_mappings.forEach(function(target_mapping) {

			var type = tile.type;
			if(type == "")
			type = target_mapping.type;

			//CHECK IF IS A MATCH
			if(checkIfIsMatch(tile,target_mapping,type) && !found)
			{
				//OVERRIDE APPID IN CASE IT IS LONGER / HAS PARAMS
				newappid = target_mapping.appid;
				if(target_mapping.appid.length < tile.appid.length || target_mapping.appid.includes("*"))
				newappid = tile.appid;

				//OVERRIDE BLACKLIST IF MATCHED
				blacklist = target_mapping.blacklist;
				if(target_mapping.blacklist.includes("BLACKLISTED_MANDATORY_PARAM"))
				blacklist = "";

				var tileTM = {
					catalogId: target_mapping.catalogId,
					catalogTitle: target_mapping.catalogTitle,
					appid: newappid,
					semanticObject: tile.semanticObject,
					semanticAction: tile.semanticAction,
					desc: tile.desc,
					type: target_mapping.type,
					category: "TileTM",
					category_tech: tile.category_tech,
					ui5_component: target_mapping.ui5_component,
					url: target_mapping.url,
					blacklist: blacklist
					//tile: tile.tile,
					//targetmapping: target_mapping.targetmapping
				};

				if(that.logger.level == "silly")
				tileTM.targetmapping = target_mapping.targetmapping

				//Check if same catalog
				if(tile.catalogId != target_mapping.catalogId)
				{
					that.logger.log('warn', "["+that.user+"] Matched TM #"+tileTM.appid+", but not in same catalog! "+tile.catalogId+ " <> "+target_mapping.catalogId);
				}
				else
				{
					that.logger.log('debug', "["+that.user+"] Matched TM #"+tileTM.appid+" in same catalog! "+tile.catalogId+ " = "+target_mapping.catalogId);
				}

				if(IsDuplicate(tileTM,merged))
				{
					tileTM.blacklist += "BLACKLIST_DUPLICATE_TILE;";
				}

				merged.push(tileTM);
				found = true;
				found_num++;
			}
		});

		//CONSISTENCY CHECK1
		if(!found)
		{
			that.logger.log('error', '['+that.user+'] Tile could not be matched to any target mapping!', {
				details: tile.catalogId+ " -> "+tile.appid+ " (Tile Name <"+tile.desc+"> Object <"+tile.semanticObject+"> Action <"+tile.semanticAction+"> Type <"+tile.type+">)"
			})
		}

		if(found_num > 1)
		{
			that.logger.log('warn', '['+that.user+'] Multiple potential target mappings found for tile!', {
				details: tile.catalogId+ " -> "+tile.appid+ " (Tile Name <"+tile.desc+"> Object <"+tile.semanticObject+"> Action <"+tile.semanticAction+"> Type <"+tile.type+">)"
			})
		}

	});

	//ADD REMAINING TARGET MAPPINGS, FLAG DUPLICATE
	target_mappings.forEach(function(target_mapping) {

		if(IsDuplicate(target_mapping,merged))
		{
			target_mapping.blacklist += "BLACKLIST_DUPLICATE_TM;";
		}
		merged.push(target_mapping);
	});

	//APPLY BLACKLIST
	merged.forEach(function(merged) {

		if (merged.type === "TR") {
			that.logger.log('debug', '['+that.user+'] WebGUI Transaction ' + merged.appid + ' blacklisted!');
			merged.blacklist += "BLACKLISTED_TR;";
		}

		if (merged.type === "WDA") {
			that.logger.log('debug', '['+that.user+'] WDA Application ' + merged.appid + ' blacklisted!');
			merged.blacklist += "BLACKLISTED_WDA;";
		}

		if (merged.type === "URL") {
			that.logger.log('debug', '['+that.user+'] URL ' + merged.appid + ' blacklisted!');
			merged.blacklist += "BLACKLISTED_URL;";
		}
		
		if(StringInArray(merged.appid, app_excludes))
		{
			that.logger.log('debug', '['+that.user+'] Application ' + merged.appid + ' blacklisted! (Exclude List)');
			merged.blacklist += "BLACKLISTED_EXCLUDE_LIST;";
		}

	});

	//CONSISTENCY CHECK2
	that.logger.log('info', '['+that.user+'] Tiles found ' + tiles.length);
	that.logger.log('info', '['+that.user+'] Target Mappings found ' + target_mappings.length);
	that.logger.log('info', '['+that.user+'] Total Chips ' + allChips);
	var total = target_mappings.length + tiles.length;
	if(total != merged.length || total != allChips)
	{
		that.logger.log('error', '['+that.user+'] Data Processing inconsistent, as # tiles and # target mappings do not match!', {
			details: "Sum Tiles/TargetMapping "+total+ " -> Merged Actual "+merged.length+" -> Target "+ allChips
		})
	}

	//return target_mappings;
	//return tiles;
	return merged;
};

//function filterByNotBlacklisted(item)
utilsabapflp.prototype.filterByNotBlacklisted = function(item)
{
	return item.blacklist == "";
};

module.exports = {
	utilsabapflp: utilsabapflp,
	getSuffix: getSuffix
};