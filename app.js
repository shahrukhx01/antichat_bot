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


var verbs, nouns, adjectives, adverbs, preposition;
nouns = ["bird", "clock", "boy", "plastic", "duck", "teacher", "old lady", "professor", "hamster", "dog"];
verbs = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed"];
adjectives = ["beautiful", "lazy", "professional", "lovely", "dumb", "rough", "soft", "hot", "vibrating", "slimy"];
adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"];
preposition = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"];

function randGen() {
return Math.floor(Math.random() * 5);
}

function sentence() {
var rand1 = Math.floor(Math.random() * 10);
var rand2 = Math.floor(Math.random() * 10);
var rand3 = Math.floor(Math.random() * 10);
var rand4 = Math.floor(Math.random() * 10);
var rand5 = Math.floor(Math.random() * 10);
var rand6 = Math.floor(Math.random() * 10);
//                var randCol = [rand1,rand2,rand3,rand4,rand5];
//                var i = randGen();
var content = "The " + adjectives[rand1] + " " + nouns[rand2] + " " + adverbs[rand3] + " " + verbs[rand4] + " because some " + nouns[rand1] + " " + adverbs[rand1] + " " + verbs[rand1] + " " + preposition[rand1] + " a " + adjectives[rand2] + " " + nouns[rand5] + " which, became a " + adjectives[rand3] + ", " + adjectives[rand4] + " " + nouns[rand6] + ".";
console.log('done');
sendText(content);
};//1.8*60000


function sendText(message){
var data = {//'antiFlood': false ,
'dialogue': "wKxPAGANdi",
'message': message,
'receiver': "public",
'_ApplicationId': "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
'_ClientVersion': "js1.11.1",
'_InstallationId': "a5cb12f0-557e-2688-b504-2b7a69734811",
'_SessionToken': "r:9728f21c4aa7b5d1c363e555cc33e8b2"};
  /*$.ajax({
      xhrFields: {
        withCredentials: false
      },
      dataType    : 'json',
      type        : 'POST',
      url         : "https://mobile-elb.antich.at/classes/Messages",
      data : data,
      success     : function(res) {
      console.log(res);
      }
    }); */

    request.post({
  headers: {'content-type' : 'application/json'},
  url:     "https://mobile-elb.antich.at/classes/Messages",
  body:    JSON.stringify(data)
}, function(error, response, body){
  console.log(JSON.stringify(body));
});


    }

//cron job for taking backups (0 0 * * *)
var j = schedule.scheduleJob('*/4 * * * *', sentence);


module.exports = server;
