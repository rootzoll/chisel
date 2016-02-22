# Chisel - PDF Coupon Generator

api for generating PDF files with nodejs, handlebars and phantomjs from HTML template.

helper for konfetti project: 

## Requirements

nodesJS >0.12 - to install latest NodeJS on Ubuntu see: https://askubuntu.com/questions/49390/how-do-i-install-the-latest-version-of-node-js

## Run Server

npm install
node src/index.js

## POST Call to create PDF with coupons

POST      http://localhost:3000/generate

HEADER   Content-Type	application/json

BODY      {	
	          "template" : "coupon-master-template.html",
	          "data" : {
		        "items": [
			          {"code" : "TESTCODE"}
		          ]
	          }
          }



