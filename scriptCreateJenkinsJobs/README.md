# Create Jenkins Job

### Purpose

Input: intents*.csv
Output: Creates preconfigured jobs for SAP Fiori launchpad smoke testing

### Installation

> cd scriptCreateJenkinsJobs

> npm install

### Run

> node index.js

> node index.js --input "../results/intents/" --jenkinsUrl "localhost:8080" --jenkinsUser "SAP" --jenkinsPassword "SAP" --gitUrl "https://github.com/frumania/sap-flp-smoke-test-uiveri5" --delete 0 --create 0 --start 1 --v

### Parameters

--input "../results/intents/"

--jenkinsUrl "localhost:8080"

--jenkinsUser "SAP"

--jenkinsPassword "SAP"

--start 0

--create 1

--delete 1

--gitUrl https://github.com/frumania/sap-flp-smoke-test-uiveri5

--v