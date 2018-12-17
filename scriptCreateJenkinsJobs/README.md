# Create Jenkins Job

### Purpose

**Input:** intents*.csv  
> "MYUSER", "MYPASSWORD", ..., "#Customer-analyzeDoubtfulAccountsAllowance"

**Output:** Creates preconfigured jobs for SAP Fiori launchpad smoke testing  
> Job "01-MYUSER-Customer-analyzeDoubtfulAccountsAllowance"

### Installation

> $ cd scriptCreateJenkinsJobs

> $ npm install

### Run

As is   
> $ node index.js

With Parameters  
> $ node index.js --input "../results/intents/" --jenkinsUrl "localhost:8080" --jenkinsUser "SAP" --jenkinsPassword "SAP" --gitUrl "https://github.com/frumania/sap-flp-smoke-test-uiveri5" --delete false --auth "sapcloud-form" --create false --start true --v

### Parameters

Specifies source directory for .csv files
>--input **"../results/intents/"**

Specifies URL/host+port for jenkins server  
>--jenkinsUrl **"localhost:8080"**

Specifies default user for jenkins server  
>--jenkinsUser **"SAP"**

Specifies default password for jenkins server  
>--jenkinsPassword **"SAP"**

Trigger builds directly after creation  
>--start **false**

Create Jobs  
>--create **true**

Delete/Purge Jobs   
>--delete **true**

Replace GIT repository URL used during uiveri5 smoke tests  
>--gitUrl **https://github.com/frumania/sap-flp-smoke-test-uiveri5**

Specify Authentication Type (ABAP/On Premise = "fiori-form"; SAP Cloud Platform = "sapcloud-form")  
>--auth **"fiori-form"**

Increase Log Level  
>--v