# Create Jenkins Job

### Purpose

**Input:** intents*.csv  
e.g.  
> "MYUSER", "MYPASSWORD", ..., "#Customer-analyzeDoubtfulAccountsAllowance"  
> ...

**Output:** Creates preconfigured jobs for SAP Fiori launchpad smoke testing  
e.g.  
> Job "01-MYUSER-Customer-analyzeDoubtfulAccountsAllowance"  
> ...

### Installation

```bash
$ cd scriptCreateJenkinsJobs
```

```bash
$ npm install
```

### Run

As is 
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
--input **"../results/intents/"**
```

Specifies URL/host+port for jenkins server  
```bash 
--jenkinsUrl **"localhost:8080"**
```

Specifies default user for jenkins server  
```bash 
--jenkinsUser **"SAP"**
```

Specifies default password for jenkins server  
```bash 
--jenkinsPassword **"SAP"**
```

Trigger builds directly after creation  
```bash 
--start **false**
```

Create Jobs  
```bash 
--create **true**
```

Delete/Purge Jobs   
```bash 
--delete **true**
```

Replace GIT repository URL used during uiveri5 smoke tests  
```bash 
--gitUrl **https://github.com/frumania/sap-flp-smoke-test-uiveri5**
```

Specify Authentication Type (ABAP/On Premise = "fiori-form"; SAP Cloud Platform = "sapcloud-form")  
```bash 
--auth **"fiori-form"**
```

Increase Log Level  
```bash 
--v
```