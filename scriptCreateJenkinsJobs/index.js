var fs = require('fs');
var path = require('path');
var csv = require('csvtojson');
var argv = require('minimist')(process.argv.slice(2));

if(argv.v)
{console.debug(argv);}

/****START SETTINGS****/
var directoryPath = typeof argv.input !== 'undefined' ? argv.input : 'results/intents/';
var forcestart = argv.start === 'true' ? true : false;
var forcecreate = argv.create === 'false' ? false : true;
var forcedelete = argv.delete === 'false' ? false : true;
var forcedeleteAll = argv.clear === 'true' ? true : false;
var jenkins_user = typeof argv.jenkinsUser !== 'undefined' ? argv.jenkinsUser : "SAP";
var jenkins_password = typeof argv.jenkinsPassword !== 'undefined' ? argv.jenkinsPassword : "SAP";
var gitUrl = typeof argv.gitUrl !== 'undefined' ? argv.gitUrl : "https://github.com/frumania/sap-flp-smoke-test-uiveri5"; //"https://github.wdf.sap.corp/D055675/uiveri5-utils";
var jenkinsUrl = typeof argv.jenkinsUrl !== 'undefined' ? argv.jenkinsUrl : "localhost:8080";
var baseUrl = 'http://'+jenkins_user+':'+jenkins_password+'@'+jenkinsUrl;
var authType = typeof argv.auth !== 'undefined' ? argv.auth : 'fiori-form'; //sapcloud-form
/****END SETTINGS****/

console.log("Input: "+directoryPath+"*.csv");
console.log("Start: "+forcestart);
console.log("Create: "+forcecreate);
console.log("Delete: "+forcedelete);
console.log("Clear: "+forcedeleteAll);
console.log("GitUrl: "+gitUrl);
console.log("JenkinsUrl: "+baseUrl);
console.log("AuthType: "+authType);

/* Doc https://github.com/silas/node-jenkins#readme */
var jenkins = require('jenkins')({ baseUrl: baseUrl, crumbIssuer: true });

var viewname = 'ALL_USERS';
var commandprefix = "/opt/selenium/startSeleniumServer.sh; cd shared; visualtest --seleniumAddress http://localhost:4444/wd/hub"; // --v";

var xmljob = fs.readFileSync('job.xml').toString();
var xmlnested = fs.readFileSync('view_nested.xml').toString();
var xmldashboard = fs.readFileSync('view_dashboard.xml').toString();

var filePath = path.join(__dirname, '../'+directoryPath);

var JenkinsJob = function() 
{
    this.xml_concat = "";
    this.total_files_count = 0;
    this.file_count = 0;

    this.getJenkinsInfo = function(){
        this.jenkins.info(function(err, data) {
            if (err) throw err;

            if(argv.v)
            console.debug('data');
        
            console.log('INFO Jenkins Info: Executors', data.numExecutors);
        });
    };

    this.start = function(){
        var that = this;

        console.log('INFO Start processing...');

        console.log('INFO Scan Directory...'+filePath);

        fs.readdir(filePath, function (err, files) {
            //handling error
            if (err) {
                console.error('ERROR Unable to scan directory: ' + err);
            }

            files.forEach(function (file) {
                
                if(file.includes("intents") && file.includes(".csv"))
                {
                    that.total_files_count++;
                } 
            });

            files.forEach(function (file) {
                
                if(file.includes("intents") && file.includes(".csv"))
                {
                    console.log('INFO File '+file);
                    that.processIntents(file);
                } 
            });
        });
    };

    this.processIntents = function(file)
    {
        var that = this;

        var csvFilePath = filePath+file;

        csv().fromFile(csvFilePath).then((testset)=>{

            that.file_count++;
            console.log("INFO Processing "+that.file_count+"/"+that.total_files_count+": "+csvFilePath);

            if(argv.v)
            {console.debug(testset);}

            var lastuser = "DUMMY";

            var counter = 1;
            
            testset.forEach(function(test){

                lastuser = test.user;

                var testSpec = "specs/app.spec.js";

                if(test.appid == "#Shell-home")
                testSpec = "specs/flp.spec.js";

                var encoded_intent = test.appid.replace("#", "");
                if(encoded_intent.includes("?"))
                {encoded_intent = encoded_intent.substring(0, encoded_intent.indexOf('?'));}
                test.encoded_intent = encoded_intent;

                //OVERRIDE (Used by Travis CI only)
                var ov_user = typeof argv.user !== 'undefined' ? argv.user : test.user;
                var ov_pw = typeof argv.password !== 'undefined' ? argv.password : test.password;

                var config = {
                    auth: {
                        [authType]: {
                        user: ov_user,
                        pass: ov_pw
                        }
                    },
                    baseUrl: test.baseUrl,
                    intent: test.appid,
                    specs: testSpec
                };

                that.processJob(counter, test, config);
                counter++;
            })

            that.prepareView(lastuser);

            //IF IS LAST FILE
            if(that.total_files_count == that.file_count)
            {
                that.processView();
            }
        });
    };

    this.processJob = function(counter, test, config)
    {
        var that = this;

        var configSTR = JSON.stringify(config);
        var command = commandprefix+" --config '"+configSTR+"'";

        if(argv.v)
        {console.debug(command);}

        command = command.replace(/&/g, '&amp;'); //&amp;
        command = command.replace(/"/g, '&quot;'); //&quot;

        var xmljobcontentsraw = xmljob.slice(0);
        var xmljobcontents = xmljobcontentsraw.replace("###COMMAND###", command);

        xmljobcontents = xmljobcontents.replace("###GIT###", gitUrl);

        var jobname = that.minTwoDigits(counter)+"-"+test.user+"-"+test.encoded_intent;

        that.jobDelete(jobname).then(function()
        {
            that.jobCreate(jobname,xmljobcontents).then(function()
            {
                that.jobStart(jobname);
            });
        });

    };

    this.jobDelete = function(jobname){

        return new Promise(function(resolve, reject) {
            if(forcedelete)
            {
                jenkins.job.destroy(jobname, function(err) {
                    if (err)
                    {
                        console.warn("WARN Job "+jobname+" could not be deleted!");
                    }
                    else
                    {
                        console.log("INFO Job "+jobname+" successfully deleted!");
                    }
                    resolve("Stuff worked!");
                });
            }
            else
            {
                resolve("Stuff worked!");
            }
        });
    }

    this.jobCreate = function(jobname, xmljobcontents)
    {
        return new Promise(function(resolve, reject) {
            if(forcecreate)
            {
                jenkins.job.create(jobname, xmljobcontents, function(err) {
                    if (err)
                    {
                        console.warn("WARN Job "+jobname+" could not be created! Job already exists?");

                        if(argv.v)
                        {
                            console.log(xmljobcontents);
                            console.log(err);
                        }
                    }
                    else
                    {
                        console.log("INFO Job "+jobname+" successfully created!");
                    }
                    resolve("Stuff worked!");
                });
            }
            else
            {
                resolve("Stuff worked!");
            }
        });
    };

    this.jobStart = function(jobname)
    {
        if(forcestart)
        {
            var req = {};
            req.path = '/job/'+jobname+'/build';
            req.params = {};

            jenkins._post(
                req,
                "",
                "",
                function(err)
                {
                    if(err)
                    {
                        console.warn("WARN Build for job "+jobname+" could not be triggered!");
                        console.log(err);
                    }
                    else
                    {
                        console.log("INFO Build for job "+jobname+" successfully triggered!");
                    }
                }
            );
        }
    };

    this.viewCreate = function(viewname)
    {
        return new Promise(function(resolve, reject) {
            if(forcecreate)
            {
                console.log("INFO Creating Nested and Dashboard Views...");
                
                jenkins.view.create(viewname, 'hudson.plugins.nested_view.NestedView', function(err) {
                    if (err)
                    {console.warn("WARN View "+viewname+" could not be created!");}
                    else
                    {console.log("INFO View "+viewname+" successfully created!");}
                    resolve("Stuff worked!");
                });
            }
            else
            {
                resolve("Stuff worked!");
            }
        });
    };

    this.viewUpdate = function(viewname,xmlnestedcontents){

        return new Promise(function(resolve, reject) {
            if(forcecreate)
            {
                jenkins.view.config(viewname, xmlnestedcontents, function(err) {
                    if (err)
                    {console.warn("WARN View "+viewname+" could not be reconfigured!");}
                    else
                    {console.log("INFO View "+viewname+" successfully reconfigured!");}
                    resolve("Stuff worked!");
                });
            }
            else
            {
                resolve("Stuff worked!");
            }
        });
    };

    this.viewDelete = function(viewname)
    {
        return new Promise(function(resolve, reject) {
            if(forcedelete || forcedeleteAll)
            {
                jenkins.view.destroy(viewname, function(err) {
                    if (err)
                    {console.warn("WARN View "+viewname+" could not be deleted!");}
                    else
                    {console.log("INFO View "+viewname+" successfully deleted!");}
                    resolve("Stuff worked!");
                });
            }
            else
            {
                resolve("Stuff worked!");
            }
        });
    };

    this.clear = function()
    {
        return new Promise(function(resolve, reject) {
            if(forcedeleteAll)
            {
                jenkins.job.list(function(err, data) 
                {
                    if(err) throw err;
                    
                    //if(argv.v){console.debug('jobs', data);}

                    var mypromises = [];

                    console.log("INFO Start removing all jobs...");

                    for (let index = 0; index < data.length; index++) {
                        const job = data[index];
                        
                        var mypromise = new Promise(function(resolveme, reject) {
                            jenkins.job.destroy(job.name, function(err) {
                                if (err)
                                {
                                    console.warn("WARN Job "+jobname+" could not be deleted!");
                                }

                                console.log('INFO Job deleted: ', job.name);

                                resolveme("Stuff worked!");
                            });
                        });
                        mypromises.push(mypromise);
                    }

                    Promise.all(mypromises).then(function(values) {
                        console.log("INFO All Jobs successfully removed!");
                        resolve("Stuff worked!");
                    });
                
                });
            }
            else
            {
                resolve("Stuff worked!");
            }
        });
    };

    this.prepareView = function(user)
    {
        var xmldashboardcontentsraw = xmldashboard.slice(0);
        var xmldashboardcontents = xmldashboardcontentsraw.replace(/###USER###/g, user);

        this.xml_concat += xmldashboardcontents;
    };

    this.processView = function()
    {
        var that = this;

        var xmlnestedcontentsraw = xmlnested.slice(0);
        var xmlnestedcontents = xmlnestedcontentsraw.replace("###VIEWS###", this.xml_concat);

        //console.debug(xmlnestedcontents);

        that.viewDelete(viewname).then(function()
        {
            that.viewCreate(viewname).then(function()
            {
                that.viewUpdate(viewname, xmlnestedcontents).then(function()
                {
                    console.log("INFO All done!");
                });
            });
        });
    };

    this.minTwoDigits = function(n) {
        return (n < 10 ? '0' : '') + n;
    }
}

var myjenkinsjob = new JenkinsJob();

myjenkinsjob.clear().then(function(){
    myjenkinsjob.start();
});

module.exports = new JenkinsJob();