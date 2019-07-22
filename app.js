const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const port = 3000;
const helmet = require('helmet');
const request = require('request');
var fs = require('fs');
var schedule = require('node-schedule');
var txtgen = require('txtgen');


app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
  next();
});

app.options('*', function(req, res) {
  res.send(200);
});

app.get('/', function(req, res) {
  res.send({data:'hello'});
});


function sendText(dialogue){
  let sentence = txtgen.sentence();
  console.log(sentence);
  var data = {//'antiFlood': false ,
  'dialogue': dialogue,
  'message': sentence,
  'receiver': "public",
  '_ApplicationId': "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
  '_ClientVersion': "js1.11.1",
  '_InstallationId': "a5cb12f0-557e-2688-b504-2b7a69734811",
  '_SessionToken': "r:9728f21c4aa7b5d1c363e555cc33e8b2"};

  request.post({
    headers: {'content-type' : 'application/json'},
    url:     "https://mobile-elb.antich.at/classes/Messages",
    body:    JSON.stringify(data)
  }, function(error, response, body){
    console.log(JSON.stringify(body));
  });


}


function getDailyBonus(){
  var data = {
    'dialogue': "wKxPAGANdi",
    'message': "/bonus",
    'receiver': "public",
    '_ApplicationId': "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
    '_ClientVersion': "js1.11.1",
    '_InstallationId': "a5cb12f0-557e-2688-b504-2b7a69734811",
    '_SessionToken': "r:9728f21c4aa7b5d1c363e555cc33e8b2"};

    request.post({
      headers: {'content-type' : 'application/json'},
      url:     "https://mobile-elb.antich.at/classes/Messages",
      body:    JSON.stringify(data)
    }, function(error, response, body){

      // appendFile function with filename, content and callback function
      var date = new Date();
      var timestamp = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

      fs.appendFile('bonus.log', JSON.parse(body).message+","+timestamp+"\n", function (err) {
        if (err) throw err;
        console.log('Bonus log written successfully.');
      });
    });


  }

  //cron job for taking backups (0 0 * * *)
  schedule.scheduleJob('*/3 * * * *', function(fireDate){
    sendText("wKxPAGANdi");
  });
  schedule.scheduleJob('*/4 * * * *', function(fireDate){
    sendText("tcO1iFGUAQ");
  });
  schedule.scheduleJob('*/5 * * * *', function(fireDate){
    sendText("Hf8AVUJw0p");
  });

  schedule.scheduleJob('0 5 * * *', getDailyBonus);

  server.listen(process.env.PORT || 5000, (err) => {
    if (err) {
      throw err;
    }
    /* eslint-disable no-console */
    console.log('Node Endpoints working :)');
  });
  module.exports = server;
