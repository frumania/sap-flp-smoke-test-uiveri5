# Create Jenkins Jobs

### Purpose

Script maintains jenkins jobs for a given url, intent, user and password combination each, so that predefined uiveri5 smoke tests can be scheduled and executed. Logs/Results are being collected.

**Input:** "intents*.csv"  
e.g.  
> "MYUSER", "MYPASSWORD", ..., "#Customer-analyzeDoubtfulAccountsAllowance"  
> ...

<img src="https://github.com/frumania/sap-flp-smoke-test-uiveri5/blob/master/docs/img/intents.png" alt="drawing"/>

**Output:** Creates preconfigured jobs for SAP Fiori launchpad smoke testing with uiveri5  
e.g.  
> Job "01-MYUSER-Customer-analyzeDoubtfulAccountsAllowance"  
> ...

<img src="https://github.com/frumania/sap-flp-smoke-test-uiveri5/blob/master/docs/img/jobs.png" alt="drawing" height="100"/>

with the following configuration:

GIT Repository: 
> https://github.com/frumania/sap-flp-smoke-test-uiveri5

Label: (-> triggers Docker Cloud Controller [uiveri5 slave](https://hub.docker.com/r/frumania/uiveri5-base/))
> myslave

Shell Commands:
```bash  
$/opt/selenium/startSeleniumServer.sh;  
```
```bash
$ cd shared;  
```
```bash
$ visualtest --seleniumAddress http://localhost:4444/wd/hub --config '{"auth":{"sapcloud-form":{"user":"MYUSER","pass":"MYPASSWORD"}},"baseUrl":"https://...","intent":"#Customer-analyzeDoubtfulAccountsAllowance","specs":"specs/app.spec.js"}'
```

Further:  
* Job: Clears Workspace
* Job: Collects uiveri5 HTML Report
* Job: Collects uiveri5 Console Error Plugin Output (error.json)
* Job: Collects uiveri5 Logger Plugin Output (pluginLoader.thml)
* Creates Nested & Dashbaord View

### Prerequisites

* [Configured Jenkins Server](https://hub.docker.com/r/frumania/docker-jenkins-preconf/)
* Generated "intents*.csv" (from scriptGetIntents)

### Installation

```bash
$ cd scriptCreateJenkinsJobs
```

```bash
$ npm install
```

### Run

As is (defaults apply)
```bash  
$ node index.js
```

With Parameters  
```bash
$ node index.js --input "../results/intents/" --jenkinsUrl "localhost:8080" --jenkinsUser "SAP" --jenkinsPassword "SAP" --gitUrl "https://github.com/frumania/sap-flp-smoke-test-uiveri5" --delete false --auth "sapcloud-form" --create false --start true --v
```

### Parameters

Specifies source directory for .csv files
```bash 
$ --input "../results/intents/"
```

Specifies URL/host+port for jenkins server  
```bash 
$ --jenkinsUrl "localhost:8080"
```

Specifies default user for jenkins server  
```bash 
$ --jenkinsUser "SAP"
```

Specifies default password for jenkins server  
```bash 
$ --jenkinsPassword "SAP"
```

Trigger builds directly after creation  
```bash 
$ --start false
```

Create Jobs  
```bash
$ --create true
```

Delete/Purge Jobs   
```bash 
$ --delete true
```

Specifies GIT source repository URL for uiveri5 smoke tests  
```bash 
$ --gitUrl "https://github.com/frumania/sap-flp-smoke-test-uiveri5"
```

Specify Authentication Type (ABAP/On Premise = "fiori-form"; SAP Cloud Platform = "sapcloud-form")  
```bash 
$ --auth "fiori-form"
```

Toggle Verbosity
```bash 
$ --v
```
