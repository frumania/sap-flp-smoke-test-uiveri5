# uiveri5-flptester

[![Build Status](https://travis-ci.org/frumania/sap-flp-smoke-test-uiveri5.svg?branch=master)](https://travis-ci.org/frumania/sap-flp-smoke-test-uiveri5)

### Prerequisites

* NodeJS >= 8.X
* Docker >= 17.x

### Quick Guide

#### Step 1) Create / Run Docker Image for Jenkins

[DockerHub Jenkins Preconfigured](https://hub.docker.com/r/frumania/docker-jenkins-preconf/)

First time only
```bash
$ docker run -d -v /var/run/docker.sock:/var/run/docker.sock -v jenkins_home:/var/jenkins_home -p 8080:8080 -p 50000:50000 frumania/docker-jenkins-preconf:latest
```

Check if container is running  
```bash
$ docker ps
```

Find out more -> [README.md](https://github.com/frumania/docker-jenkins-preconf/blob/master/README.md)

#### Step 2) Prepare Docker Slave Image for Jenkins

[DockerHub Jenkins Uiveri5 Slave](https://hub.docker.com/r/frumania/uiveri5-base/)

```bash
$ docker pull frumania/uiveri5-base:latest
```

Find out more -> [README.md](https://github.com/frumania/docker-uiveri5-jenkins-slave/blob/master/README.md)

#### Step 3) Generate Test Set

Maintain file <user.csv>

Find out more -> [README.md](https://github.com/frumania/sap-flp-smoke-test-uiveri5/blob/master/scriptGetIntents/README.md)

#### Step 4) Create Jenkins Jobs

Find out more -> [README.md](https://github.com/frumania/sap-flp-smoke-test-uiveri5/blob/master/scriptCreateJenkinsJobs/README.md)

#### Step 5) Access Jenkins via browser

Via browser open **http://localhost:8080**

> User: SAP

> PW: SAP

**Output Image**