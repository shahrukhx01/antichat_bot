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


function sendText(dialogue,text){

  var data = {//'antiFlood': false ,
  'dialogue': dialogue,
  'message': text,
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


  function getUsersList(){
    var data = {
      "dialogue":"wKxPAGANdi",
      "v":10001,
      "_ApplicationId":"fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
      "_ClientVersion":"js1.11.1",
      "_InstallationId":"a5cb12f0-557e-2688-b504-2b7a69734811",
      "_SessionToken":"r:9728f21c4aa7b5d1c363e555cc33e8b2"
    };

    request.post({
      headers: {'content-type' : 'application/json'},
      url:     "https://mobile-elb.antich.at/functions/getActiveUsers",
      body:    JSON.stringify(data)
    }, function(error, response, body){

      // appendFile function with filename, content and callback function
      var date = new Date();
      var timestamp = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

      var usersDict = {};
      JSON.parse(body).result.forEach(element => {
        usersDict[element.objectId] = element.profileName;
      });
      getRecentMessages(usersDict);
    });
  }

  function getRecentMessages(users){
    var d = new Date();
    // d = Mon Feb 29 2016 08:00:09 GMT+0100 (W. Europe Standard Time)
    var milliseconds = Date.parse(d);
    // 1456729209000
    milliseconds = milliseconds - (1 * 60 * 1000);
    // - 5 minutes
    var d_ = new Date(milliseconds).toISOString();
    var data = {
      "laterThan": {"iso": d_, "__type": "Date"},
      "dialogueId": "wKxPAGANdi",
      "v": 10001,
      "_ApplicationId": "fUEmHsDqbr9v73s4JBx0CwANjDJjoMcDFlrGqgY5",
      "_ClientVersion": "js1.11.1",
      "_InstallationId": "a5cb12f0-557e-2688-b504-2b7a69734811",
      "_SessionToken": "r:9728f21c4aa7b5d1c363e555cc33e8b2"
    };

    request.post({
      headers: {'content-type' : 'application/json'},
      url:     "https://mobile-elb.antich.at/functions/getMessages",
      body:    JSON.stringify(data)
    }, function(error, response, body){

      // appendFile function with filename, content and callback function
      var userTexts = [];
      JSON.parse(body).result.forEach(element => {
        if (users[element.senderId] != undefined)
        userTexts.push({name: users[element.senderId].trim(), text: element.message});
      });

      userTexts = userTexts.filter(obj => Object.keys(obj).includes("name"));
      console.log(JSON.stringify(userTexts));
      getBotReply(userTexts[Math.floor(Math.random()*userTexts.length)]);
    });
  }


  function getBotReply(userText){
    var text = JSON.stringify({	text: userText.text});
    console.log(text);
    request.post({
      headers: {'content-type' : 'application/json'},
      url:     "https://anti-botx01.herokuapp.com/get_reply",
      body: text
    }, function(error, response, body){
      var text = "@"+userText.name+", "+JSON.parse(body).reply;
      console.log("*** resp generated ***");
      console.log(text);
      sendText("wKxPAGANdi",text);

    });
  }
  //cron job for taking backups (0 0 * * *)
  schedule.scheduleJob('*/1 * * * *', function(fireDate){
    //NEWBIES
    getUsersList();
    console.log("sent to group Newbies.");
  });
  schedule.scheduleJob('*/3 * * * *', function(fireDate){
    //IND
    let sentence = txtgen.sentence();
    sendText("M7xQglSsRN",sentence);
    console.log("sent to group IND.");
  });
  schedule.scheduleJob('*/4 * * * *', function(fireDate){
    //LFINDER.
    let sentence = txtgen.sentence();
    sendText("Hf8AVUJw0p",sentence);
    console.log("sent to group LFINDER.");
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
