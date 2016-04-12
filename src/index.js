var fs = require('fs');
var Pdf = require('html-pdf');
var Handlebars = require('handlebars');
var express = require('express');
var server = express();

var genCount = 0;

function makeReply(reply){
  return function(err, stream){
    //console.log(JSON.stringify(reply));
    reply.setHeader('Content-Type', 'application/pdf');
    stream.pipe(reply);
  }
}

server.get('/generate', function (req, res) {

    var request = {
        payload : {
            template : "coupon-master-template.html",
            data : {
                items : []
            }
        }
    };

    // if now template set - use default template
    if ((typeof req.query.template!="undefined") && (req.query.template!="undefined")) request.payload.template = req.query.template;

    // for code coupon printing
    if ((typeof req.query.codes != "undefined") && (req.query.codes!="undefined")) {
        var codes = req.query.codes.split(",");
        for (var i=0; i<codes.length; i++) {
            var code = codes[i];
            request.payload.data.items.push({code:code});
        }
    } else

    // for general PDF generation (item array per parameter)
    if ((typeof req.query.items != "undefined") && (req.query.items!="undefined")) {
        request.payload.data.items = JSON.parse(req.query.items);
    }

    console.log("****** GENERATE PDF *********");
    console.log("payload: "+JSON.stringify(request.payload));
    console.log('template: '+JSON.stringify(request.payload.template));
    console.log('data.items: '+JSON.stringify(request.payload.data.items));
    queueJob(request.payload.template, request.payload.data, makeReply(res));

});
server.listen(2342);
console.log('Running on port 2342 - for testing call: http://localhost:2342/generate?codes=1,2,3');

var MAX_WORKERS = 4;//max pdfs creation triggers at a time

var queue = [];
var workers = 0;//active workers

function queueJob(template, data, callback){

  genCount++;

  console.log("queue job "+genCount+", length: "+queue.length+", workers: "+workers);
  queue.push({
      template: template,
      data: data,
      callback: callback,
      genCount: genCount
    });

  processQueue();
}


function jobFinished(genCount){
  return function(){
    console.log("** job finished: "+genCount);
    workers--;
    processQueue();
  };
}

function makePDFGenCallback(nextJob){
  return function(err, stream){
    stream.on('end', jobFinished(nextJob.genCount));
    nextJob.callback(err, stream);
  }
}


function processQueue(){
  console.log("process queue");

  if(workers < MAX_WORKERS && queue.length > 0){

    nextJob = queue.shift();

    console.log("** process request "+nextJob.genCount);

    workers++;

    var template = compileTemplate(nextJob.template);    

    var html = template(nextJob.data);

    var options = { format: 'A4' };

    Pdf.create(html, options).toStream(makePDFGenCallback(nextJob));
  } else {
    console.log("nothing to do or waiting for another worker to finish, length: "+queue.length+", workers: "+workers);
  }
}

function compileTemplate(templateName){

  var file;
  if (templateName.indexOf("http")==0) {
    file = fs.readFileSync(templateName, {encoding: 'utf8'});
  } else {
    file = fs.readFileSync('templates/'+templateName, {encoding: 'utf8'});
  }

  return Handlebars.compile(file);
}