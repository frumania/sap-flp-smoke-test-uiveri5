# SAP Fiori smoke test tool based on UIVERI5

[![Build Status](https://travis-ci.org/frumania/sap-flp-smoke-test-uiveri5.svg?branch=master)](https://travis-ci.org/frumania/sap-flp-smoke-test-uiveri5)

Test automation tool for the startup of SAPUI5/Fiori Apps inside the SAP Fiori launchpad based on [UIVERI5](https://github.com/SAP/ui5-uiveri5).

Successor of [OPA5 smoke test tool](https://github.com/frumania/sap-flp-smoke-test-opa5), now allows easy mass scheduling and reporting.

### Prerequisites

* [NodeJS](https://nodejs.org) >= 8.X
* [Docker](https://docker.com) >= 17.x

### Quick Guide

See also [walkthrough video](https://sapvideoa35699dc5.hana.ondemand.com/?entry_id=1_qbdcmkyz)!
<br>
<br>

### Step 0) Download / Clone Repository

You can download the repository as .zip file to your disk directly via the menu on the top right.

Alternative (requires GIT)

In terminal, create a local copy by executing  
```bash
$ git clone https://github.com/frumania/sap-flp-smoke-test-uiveri5
```

See also this [guide](https://help.github.com/articles/cloning-a-repository/).
<br>
<br>

### Step 1) Create / Run Docker Image for Jenkins

**Once** only
```bash
$ docker run -d -v /var/run/docker.sock:/var/run/docker.sock -v jenkins_home:/var/jenkins_home -p 8080:8080 -p 50000:50000 frumania/docker-jenkins-preconf:latest
```

Check if container is running  
```bash
$ docker ps
```

Find out more:
* [README.md](https://github.com/frumania/docker-jenkins-preconf/blob/master/README.md)
* [DockerHub Jenkins Preconfigured](https://hub.docker.com/r/frumania/docker-jenkins-preconf/)
<br>
<br>

### Step 2) Prepare Docker Slave Image for Jenkins

```bash
$ docker pull frumania/uiveri5-base:latest
```

Find out more:
* [README.md](https://github.com/frumania/docker-uiveri5-jenkins-slave/blob/master/README.md)
* [DockerHub Jenkins Uiveri5 Slave](https://hub.docker.com/r/frumania/uiveri5-base/)
<br>
<br>

### Step 3) Generate Test Set

Maintain file ["user.csv"](https://github.com/frumania/sap-flp-smoke-test-uiveri5/blob/master/user.csv)

Switch Directory  
```bash
$ cd scriptGetIntents
```

**Once** only 
```bash
$ npm install
```

Run (HOST/PORT should match the Fiori Frontend Server, where the launchpad is running)
```bash
$ node index.js --url "https://HOST:PORT"
```

Find out more:
* [README.md](https://github.com/frumania/sap-flp-smoke-test-uiveri5/blob/master/scriptGetIntents/README.md)
<br>
<br>

### Step 4) Create Jenkins Jobs

Switch Directory  
```bash
$ cd scriptCreateJenkinsJobs
```

**Once** only
```bash
$ npm install
```

Run  
```bash
$ node index.js
```

Find out more:
* [README.md](https://github.com/frumania/sap-flp-smoke-test-uiveri5/blob/master/scriptCreateJenkinsJobs/README.md)
<br>
<br>

### Step 5) Access Jenkins via browser

Via browser open **http://localhost:8080**

> User: SAP

> PW: SAP
<br>
<br>

## Support & Contribution

This project is provided "as-is". There is no guarantee that raised issues will be answered or addressed in future releases.

If you like to contribute, fork the code and/or let me know!

## Screenshots

![DEMO](https://github.com/frumania/sap-flp-smoke-test-uiveri5/blob/master/docs/img/1.png)

![DEMO](https://github.com/frumania/sap-flp-smoke-test-uiveri5/blob/master/docs/img/2.png)

![DEMO](https://github.com/frumania/sap-flp-smoke-test-uiveri5/blob/master/docs/img/3.png)

## License

[![Apache 2](https://img.shields.io/badge/license-Apache%202-blue.svg)](./LICENSE.txt)
