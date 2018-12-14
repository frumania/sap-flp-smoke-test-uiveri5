# Get Intents

### Purpose

Processes csv input file and resolves all SAP Fiori launchpad intents (tile / target mapping) for a given user.

### Installation

Execute in terminal/cmd

> cd scriptGetIntents

> npm install

### Run

> node.index.js -url "https://52.201.167.55:8001"

> node index.js -url "https://52.201.167.55:8001" -sap-client "000" -input "../user.csv" -output "../results/intents/" -addShellHome 1 -v

### Parameters

url

sap-client

input

output

addShellHome

v