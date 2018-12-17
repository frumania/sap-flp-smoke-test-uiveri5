var fs = require('fs');
var path = require('path');
var csv = require('csvtojson');
var abapFLP = require('./utils-abap-flp');
var request = require('request');
var logger = require('./logger').getLogHandler();
var argv = require('minimist')(process.argv.slice(2));

if(argv.v)
{console.debug(argv);}

/****START SETTINGS****/
var csvFilePath = typeof argv.input !== 'undefined' ? argv.input : '../user.csv';
var resultsFilePath = typeof argv.output !== 'undefined' ? argv.output : '../results/intents/';
var flpUrl = typeof argv.url !== 'undefined' ? argv.url : "https://52.201.167.55:8001";
var suffix = typeof argv.suffix !== 'undefined' ? argv.suffix : "?sap-language=EN&sap-client=000";
var addShellHome = argv.addShellHome === 'false' ? false : true;
/****END SETTINGS****/

var testLocal = argv.testLocal === 'true' ? true : false;

if(argv.v){require('request').debug = true;}

csv().fromFile(csvFilePath).then((testset)=>{

    //console.debug(testset);
    
    testset.forEach(function(test) { 

        logger.log('debug', "["+test.user+"] ## NEW RUN ##");
        logger.log('debug', "["+test.user+"] Fetching Catalogs...");

        //PERFORM GET REQUEST
        var url = flpUrl + abapFLP.getSuffix() + suffix.replace(/([?])/g, "&");

        logger.log('debug', "["+test.user+"] "+url);

        var options = {
            'auth': {
              'user': test.user,
              'pass': test.password,
              'sendImmediately': true
        }};

        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
        request.get(url,options,function(error,res,body)
        {
            if((error || (res && res.statusCode && res.statusCode !== 200)) && !testLocal)
            {
                message = error ? error : res.statusCode + " "+res.statusMessage;

                //WRITE ERROR LOGFILE
                logger.log('error', '['+test.user+'] Catalogs could not be fetched ->', {
                    details: message
                })
            }
            else
            {
                try 
                {
                    if(testLocal){body = fs.readFileSync("sample.json");}

                    if(argv.v)
                    {
                        const file = resultsFilePath+'/catalogservice_'+test.user+'.json';
                        fs.writeFile(file, body, function(err) {
                            if(err) {
                                return console.log(err);
                            }
                            logger.log('debug', '['+test.user+'] File <'+file+'> written');
                        });
                    }

                    //CONVERT TO JSON
                    var jsonBody = JSON.parse(body);

                    //PROCESS DATA
                    var utilsabapflp = new abapFLP.utilsabapflp(test.user, logger);
                    var intents_full = utilsabapflp.getIntents(jsonBody);

                    //FILTER ARRAY
                    var intents = intents_full.filter(utilsabapflp.filterByNotBlacklisted);
                    //var intents = intents_full;

                    //ENRICH
                    var results = [];

                    if(addShellHome)
                    {
                        shellhome = {};
                        shellhome.appid = "#Shell-home";
                        intents.push(shellhome);
                    }

                    intents.forEach(function(intent) {
                        
                        //ADD TO BEGINNING OF OBJECT
                        intent = Object.assign({"password": test.password}, intent);
                        intent = Object.assign({"user": test.user}, intent);

                        intent.baseUrl = flpUrl+"/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html"+suffix;

                        //OPTIONAL ADD ManifestURL
                        
                        results.push(intent);
                    });

                } catch (error) {
                    logger.log('error', '['+test.user+'] Catalog Data could not be processed!', {
                        details: error
                    })
                }

                if(results.length > 0)
                {
                    //START GENERATE CSV
                    const Json2csvParser = require('json2csv').Parser;
                    const file = resultsFilePath+'/intents_'+test.user+'.csv';
                    try 
                    {
                        const parser = new Json2csvParser({ flatten: true, unwind: 'tile' });
                        const csv = parser.parse(results);
                        fs.writeFile(file, csv, function (error) {
                            if (error){
                                return logger.log('error', '['+test.user+'] File <'+file+'> could not be written!', {
                                    details: error
                                })
                            }
                            logger.log('debug', '['+test.user+'] File <'+file+'> written');
                        });
                    } catch (error) {
                        logger.log('error', '['+test.user+'] File <'+file+'> could not be written!', {
                            details: error
                        })
                    }
                    //END GENERATE CSV
                }
                else
                {
                    logger.log('warn', '['+test.user+'] No intents found after applying filter!');
                }
            }
        });
    })
})