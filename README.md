# uiveri5-flptester

[![Build Status](https://travis-ci.org/frumania/sap-flp-smoke-test-uiveri5.svg?branch=master)](https://travis-ci.org/frumania/sap-flp-smoke-test-uiveri5)

### Prerequisites

* NodeJS >= 8.X
* Docker >= 17.x

### Installation

Step 1) Create / Run Docker Image for Jenkins

[DockerHub Jenkins Preconfigured](https://hub.docker.com/r/frumania/docker-jenkins-preconf/)

First time only
> docker run -d -v /var/run/docker.sock:/var/run/docker.sock -v jenkins_home:/var/jenkins_home -p 8080:8080 -p 50000:50000 frumania/docker-jenkins-preconf:latest

> docker ps

see also ...

Step 2) Prepare Docker Slave Image for Jenkins

[DockerHub Jenkins Uiveri5 Slave](https://hub.docker.com/r/frumania/uiveri5-base/)

> docker pull frumania/uiveri5-base:latest

Step 3) Generate Test Set

see scriptGetIntents -> README.md

Step 4) Create Jenkins Jobs

see scriptCreateJenkinsJobs -> README.md

Step 5) Access Jenkins via browser

http://localhost:8080

> User: SAP

> PW: SAP