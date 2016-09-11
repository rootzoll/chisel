# Konfetti - PDF Coupon Generator

Small service for generating PDF files with nodejs, handlebars and phantomjs from HTML template.

Part of the Konfetti project: https://github.com/rootzoll/konfetti-app

## Requirements

nodesJS >0.12 - to install latest NodeJS on Ubuntu see: https://askubuntu.com/questions/49390/how-do-i-install-the-latest-version-of-node-js

## Run Server

npm install
node src/index.js

## GET Call to create PDF

There are two modes to call the service with HTTP GET when running:

# 1. List of Codes

Use parameter named 'codes' with a comma separated list of code strings as value.
This will work with a template that has just one field named '{{code}}'.
Use this mode to generate a big batch of code coupons etc.

# 2. Multiple Item Object Array

For more detailed content replacement use a parameter called 'items'.
As value give a JSON array containing objects.
Every value of an object property will get replaced within the template with the '{{property-name}}'.

Example:
```
[{"name": "Christian","konfetti": "100"},{"name": "Björn","konfetti": "999"}]
```



