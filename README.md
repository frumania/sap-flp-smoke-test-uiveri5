# SAP Fiori smoke test tool based on UIVeri5

[![Build Status](https://travis-ci.org/frumania/sap-flp-smoke-test-uiveri5.svg?branch=master)](https://travis-ci.org/frumania/sap-flp-smoke-test-uiveri5)

Test automation tool for the startup of SAPUI5/Fiori Apps inside the SAP Fiori launchpad based on [UIVeri5](https://github.com/SAP/ui5-uiveri5).

### Prerequisites

* [NodeJS](https://nodejs.org) >= 8.X
* [Docker](https://docker.com) >= 17.x

### Quick Guide

See also [walkthrough video]()!
<br>
<br>

### Step 0) Download / Clone Repository

In terminal, create a local copy by executing  
```bash
$ git clone https://github.com/frumania/sap-flp-smoke-test-uiveri5
```

You can also follow this [guide](https://help.github.com/articles/cloning-a-repository/).

As an alternative, you can also download the repository as .zip file to your disk via the menu on the top right.
<br>
<br>

### Step 1) Create / Run Docker Image for Jenkins

First time only
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
* [DockerHub Jenkins UIVeri5 Slave](https://hub.docker.com/r/frumania/uiveri5-base/)
<br>
<br>

### Step 3) Generate Test Set

Maintain file ["user.csv"](https://github.com/frumania/sap-flp-smoke-test-uiveri5/blob/master/user.csv)

Switch Directory  
```bash
$ cd scriptGetIntents
```

First time only  
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

First time only
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
