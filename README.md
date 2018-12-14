# uiveri5-flptester

### Prerequisites

* NodeJS >= 8.X
* Docker >= 18.x

### Installation

Step 1) Create / Run Docker Image for Jenkins

[DockerHub Jenkins Preconfigured](https://hub.docker.com/r/frumania/docker-jenkins-preconf/)

> docker pull docker-jenkins-preconf:latest

First time only
> docker run -d -v /var/run/docker.sock:/var/run/docker.sock -v jenkins_home:/var/jenkins_home -p 8080:8080 -p 50000:50000 docker-jenkins-preconf:latest

> docker ps

> docker stop <\ContainerID\>

> docker start <\ContainerID\>

Step 2) Prepare Docker Slave Image for Jenkins

[DockerHub Jenkins Uiveri5 Slave](https://hub.docker.com/r/frumania/uiveri5-base/)

> docker pull frumania/uiveri5-base:latest

Step 3) Generate Test Set

see scriptGetIntents

Step 4) Create Jenkins Jobs

see scriptCreateJenkinsJobs

Step 5) Access Jenkins via browser

http://localhost:8080

> User: SAP

> PW: SAP