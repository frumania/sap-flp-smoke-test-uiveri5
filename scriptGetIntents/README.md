# Get Intents

### Purpose

Processes csv input file and resolves all SAP Fiori launchpad intents (tile / target mapping) for a given user.

**Input:** "user.csv"   
e.g.  
<img src="https://github.com/frumania/sap-flp-smoke-test-uiveri5/blob/master/docs/img/user.png" alt="drawing" height="100"/>

**Output:** "intents_MYUSER.csv", ...    
e.g.  
> "MYUSER", "MYPASSWORD", ..., "#Customer-analyzeDoubtfulAccountsAllowance"  
> ...

<img src="https://github.com/frumania/sap-flp-smoke-test-uiveri5/blob/master/docs/img/intents.png" alt="drawing"/>

### Prerequisites

* SAP Netweaver ABAP >= 7.51
* SAP Fiori launchpad frontend server
* ["user.csv"](https://github.com/frumania/sap-flp-smoke-test-uiveri5/blob/master/user.csv) maintained

### Installation

Execute in terminal/cmd

```bash
$ cd scriptGetIntents
```

```bash
$ npm install
```

### Run

As is (defaults apply)  
```bash
$ node index.js --url "https://52.201.167.55:8001"
```

With parameters  
```bash
$ node index.js --url "https://52.201.167.55:8001" --suffix "?sap-language=EN&sap-client=000" --input "user.csv" --output "results/intents/" --addShellHome true --v
```

### Logging

> combined.log

> error.log

### Parameters

Syntax
```bash 
$ --<param> <value>
```
just append to the command itself! The **defaults** are shown below!  
  
  
Specifies SAP system url/host
```bash
$ --url "https://HOST:PORT"
```

Specifies url suffix
```bash
$ --suffix "?sap-language=EN&sap-client=000"
```

Specifies source directory for .csv user file
```bash
$ --input "user.csv"
```

Specifies target directory for generated intents*.csv files
```bash
$ --output "results/intents/"
```

Creates additional "#Shell-home" intent, which can be used to test the SAP Fiori launchpad dashboard (dynamic tiles)
```bash
$ --addShellHome true
```

Toggle Verbosity  
```bash
$ --v
```
