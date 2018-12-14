# Create Jenkins Job

### Purpose

Input: intents*.csv
Output: Creates preconfigured jobs for SAP Fiori launchpad smoke testing

### Installation

> cd scriptCreateJenkinsJobs

> npm install

### Run

> node index.js

> node index.js --input "../results/intents/" --jenkinsUrl "localhost:8080" --jenkinsUser "SAP" --jenkinsPassword "SAP" --gitUrl "https://github.com/frumania/sap-flp-smoke-test-uiveri5" --delete false --create false --start true --v

### Parameters

--input "../results/intents/"

--jenkinsUrl "localhost:8080"

--jenkinsUser "SAP"

--jenkinsPassword "SAP"

--start false

--create true

--delete true

--gitUrl https://github.com/frumania/sap-flp-smoke-test-uiveri5

--v